<?php

declare(strict_types=1);

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

require dirname(__DIR__).'/vendor/autoload.php';

$repository = getenv('GITHUB_REPOSITORY') ?: 'Metsue/nandasayang';
[$owner, $name] = array_pad(explode('/', $repository, 2), 2, '');
if ($owner === '' || $name === '' || !preg_match('/^[A-Za-z0-9._-]+$/', $owner.$name)) {
    fwrite(STDERR, "Invalid GitHub repository name.\n");
    exit(1);
}

$siteUrl = sprintf('https://%s.github.io/%s/', strtolower($owner), $name);
$output = $argv[1] ?? dirname(__DIR__).'/build/pages';
$app = require dirname(__DIR__).'/bootstrap/app.php';
$request = Request::create('/', 'GET');
$app->instance('request', $request);
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();
URL::forceRootUrl($siteUrl);
URL::forceScheme('https');

$response = $kernel->handle($request);
$kernel->terminate($request, $response);
if ($response->getStatusCode() !== 200 || !str_contains($response->getContent(), 'id="anniversary-data"')) {
    fwrite(STDERR, "Could not render the anniversary page.\n");
    exit(1);
}

if (!is_dir($output) && !mkdir($output, 0775, true) && !is_dir($output)) {
    fwrite(STDERR, "Could not create the output directory.\n");
    exit(1);
}

$html = $response->getContent();
if (str_contains($html, 'localhost') || str_contains($html, '/nandasayang/public/')) {
    fwrite(STDERR, "The rendered page contains a local asset URL.\n");
    exit(1);
}
file_put_contents($output.'/index.html', $html);
file_put_contents($output.'/.nojekyll', '');

$source = dirname(__DIR__).'/public';
$copy = function (string $from, string $to) use (&$copy): void {
    if (is_dir($from)) {
        if (!is_dir($to) && !mkdir($to, 0775, true) && !is_dir($to)) {
            throw new RuntimeException("Could not create $to");
        }
        foreach (new DirectoryIterator($from) as $entry) {
            if ($entry->isDot()) continue;
            $copy($entry->getPathname(), $to.'/'.$entry->getFilename());
        }
        return;
    }
    if (!copy($from, $to)) throw new RuntimeException("Could not copy $from");
};

foreach (['css', 'js', 'fonts', 'images', 'favicon.svg', 'favicon.ico'] as $asset) {
    $copy($source.'/'.$asset, $output.'/'.$asset);
}
if (is_dir($source.'/audio')) $copy($source.'/audio', $output.'/audio');

echo "GitHub Pages files built in $output for $siteUrl\n";

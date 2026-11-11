<?php

namespace App\Http\Controllers;

use DateTimeImmutable;
use DateTimeZone;
use Illuminate\View\View;

class AnniversaryController extends Controller
{
    public function __invoke(): View
    {
        $anniversary = config('anniversary');
        if (empty($anniversary['music_path']) && is_file(public_path('audio/lagu-kita.mp3'))) {
            $anniversary['music_path'] = 'audio/lagu-kita.mp3';
        }
        $start = null;
        $date = $anniversary['start_date'];

        if (is_string($date) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            try {
                $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone($anniversary['timezone']));
                if ($parsed && $parsed->format('Y-m-d') === $date && $parsed <= new DateTimeImmutable()) {
                    $start = $parsed->format(DATE_ATOM);
                }
            } catch (\Exception) {
                // An incomplete date setting should never interrupt the gift.
            }
        }

        return view('anniversary', compact('anniversary', 'start'));
    }
}

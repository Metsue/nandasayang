<?php

namespace Tests\Feature;

use Tests\TestCase;

class AnniversaryTest extends TestCase
{
    public function test_anniversary_renders_the_couple_and_real_start_date(): void
    {
        $this->get('/')->assertOk()
            ->assertSee('Nanda Aula Selfiyana')
            ->assertSee('Indra')
            ->assertSee('2024-11-15T00:00:00+07:00', false)
            ->assertSee('Sempurna')
            ->assertDontSee('Happy Birthday');
    }

    public function test_invalid_date_falls_back_without_breaking_the_gift(): void
    {
        config(['anniversary.start_date' => '2024-02-31']);
        $this->get('/')->assertOk()->assertSee('TAHUN CERITA')->assertDontSee('data-start=', false);
    }

    public function test_future_date_does_not_render_negative_counter(): void
    {
        config(['anniversary.start_date' => '2099-11-15']);
        $this->get('/')->assertOk()->assertDontSee('data-start=', false);
    }

    public function test_every_gallery_image_has_a_full_and_small_local_asset(): void
    {
        foreach (config('anniversary.photos') as $photo) {
            $this->assertFileExists(public_path('images/'.$photo['file'].'.webp'));
            $this->assertFileExists(public_path('images/'.$photo['file'].'-small.webp'));
        }
    }

    public function test_unknown_pages_return_a_real_not_found_status(): void
    {
        $this->get('/a-page-that-does-not-exist')->assertNotFound();
    }
}

@props(['name' => 'heart'])
<svg {{ $attributes->merge(['class' => 'icon']) }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
@switch($name)
    @case('arrow') <path d="M5 12h14m-5-5 5 5-5 5"/> @break
    @case('down') <path d="M12 5v14m-5-5 5 5 5-5"/> @break
    @case('close') <path d="m6 6 12 12M6 18 18 6"/> @break
    @case('music') <path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2.5"/><ellipse cx="17" cy="16" rx="3" ry="2.5"/> @break
    @case('play') <path d="m9 5 11 7-11 7V5Z"/> @break
    @case('mail') <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/> @break
    @case('sparkle') <path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z"/> @break
    @case('camera') <path d="M8 5 9.5 3h5L16 5h4a1 1 0 0 1 1 1v13H3V6a1 1 0 0 1 1-1h4Z"/><circle cx="12" cy="12" r="4"/> @break
    @case('refresh') <path d="M20 7v5h-5M4 17v-5h5M5.5 7a7 7 0 0 1 11.5-2L20 9M4 15l3 4a7 7 0 0 0 11.5-2"/> @break
    @case('expand') <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/> @break
    @default <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>
@endswitch
</svg>

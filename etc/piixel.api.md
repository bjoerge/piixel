## API Report File for "piixel"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export function colorwheel(pos: number): number;

// @public
export type PCMGpio = 21 | 31;

// @public
export type PWM0Gpio = 12 | 18 | 40 | 52;

// @public
export type PWM1Gpio = 13 | 19 | 41 | 45 | 53;

// @public
export interface RenderOptions {
    brightness?: number;
    pixels?: Uint32Array;
}

// @public
export function rgb2hex(r: number, g: number, b: number): number;

// @public
export type SPIGpio = 10 | 38;

// @public
export enum StripType {
    // (undocumented)
    SK6812_STRIP = 528384,
    // (undocumented)
    SK6812_STRIP_BGRW = 402655248,
    // (undocumented)
    SK6812_STRIP_BRGW = 402657288,
    // (undocumented)
    SK6812_STRIP_GBRW = 403177488,
    // (undocumented)
    SK6812_STRIP_GRBW = 403181568,
    // (undocumented)
    SK6812_STRIP_RBGW = 403701768,
    // (undocumented)
    SK6812_STRIP_RGBW = 403703808,
    // (undocumented)
    SK6812W_STRIP = 403181568,
    // (undocumented)
    WS2811_STRIP_BGR = 2064,
    // (undocumented)
    WS2811_STRIP_BRG = 4104,
    // (undocumented)
    WS2811_STRIP_GBR = 524304,
    // (undocumented)
    WS2811_STRIP_GRB = 528384,
    // (undocumented)
    WS2811_STRIP_RBG = 1048584,
    // (undocumented)
    WS2811_STRIP_RGB = 1050624,
    // (undocumented)
    WS2812_STRIP = 528384
}

// @public
export type ValidGPIO = PWM0Gpio | PWM1Gpio | PCMGpio | SPIGpio;

// @public
export const ws281x: Ws281xAPI;

// @public
export interface Ws281xAPI {
    clear(): void;
    configure(options: Ws281xConfig): void;
    render(renderOptions: RenderOptions): void;
    render(pixels: Uint32Array): void;
    reset(): void;
}

// @public
export interface Ws281xConfig {
    dma?: number;
    gpio?: ValidGPIO;
    leds: number;
    resetOnExit?: boolean;
    type?: StripType;
}

```

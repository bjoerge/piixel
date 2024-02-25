import pixel, {StripType} from './'

pixel.configure({gpio: 18, leds: 16})

console.log(pixel.render(new Uint32Array(16)))
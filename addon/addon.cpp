#include "addon.h"

#define DEFAULT_TARGET_FREQ 800000
#define DEFAULT_GPIO_PIN 18
#define DEFAULT_DMA 10
#define DEFAULT_TYPE WS2811_STRIP_RGB

static ws2811_t ws2811;

static uint8_t gammaCorrection[256] = {
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
        2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
        6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 11, 11,
        11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18,
        19, 19, 20, 21, 21, 22, 22, 23, 23, 24, 25, 25, 26, 27, 27, 28,
        29, 29, 30, 31, 31, 32, 33, 34, 34, 35, 36, 37, 37, 38, 39, 40,
        40, 41, 42, 43, 44, 45, 46, 46, 47, 48, 49, 50, 51, 52, 53, 54,
        55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        71, 72, 73, 74, 76, 77, 78, 79, 80, 81, 83, 84, 85, 86, 88, 89,
        90, 91, 93, 94, 95, 96, 98, 99, 100, 102, 103, 104, 106, 107, 109, 110,
        111, 113, 114, 116, 117, 119, 120, 121, 123, 124, 126, 128, 129, 131, 132, 134,
        135, 137, 138, 140, 142, 143, 145, 146, 148, 150, 151, 153, 155, 157, 158, 160,
        162, 163, 165, 167, 169, 170, 172, 174, 176, 178, 179, 181, 183, 185, 187, 189,
        191, 193, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220,
        222, 224, 227, 229, 231, 233, 235, 237, 239, 241, 244, 246, 248, 250, 252, 255};

void setDefaults() {
  ws2811.freq = DEFAULT_TARGET_FREQ;
  ws2811.dmanum = DEFAULT_DMA;

  ws2811.channel[0].gpionum = DEFAULT_GPIO_PIN;
  ws2811.channel[0].count = 0;
  ws2811.channel[0].invert = 0;
  ws2811.channel[0].brightness = 255;
  ws2811.channel[0].strip_type = DEFAULT_TYPE;
  ws2811.channel[0].gamma = gammaCorrection;

  ws2811.channel[1].gpionum = 0;
  ws2811.channel[1].count = 0;
  ws2811.channel[1].invert = 0;
  ws2811.channel[1].brightness = 0;
  ws2811.channel[1].strip_type = 0;
}

std::string getErrorMessage(ws2811_return_t ret_val) {
   if (ret_val == WS2811_ERROR_GENERIC) return  "Generic failure";
   if (ret_val == WS2811_ERROR_OUT_OF_MEMORY) return  "Out of memory";
   if (ret_val == WS2811_ERROR_HW_NOT_SUPPORTED) return  "Hardware revision is not supported";
   if (ret_val == WS2811_ERROR_MEM_LOCK) return  "Memory lock failed";
   if (ret_val == WS2811_ERROR_MMAP) return  "mmap() failed";
   if (ret_val == WS2811_ERROR_MAP_REGISTERS) return  "Unable to map registers into userspace";
   if (ret_val == WS2811_ERROR_GPIO_INIT) return  "Unable to initialize GPIO";
   if (ret_val == WS2811_ERROR_PWM_SETUP) return  "Unable to initialize PWM";
   if (ret_val == WS2811_ERROR_MAILBOX_DEVICE) return  "Failed to create mailbox device";
   if (ret_val == WS2811_ERROR_DMA) return  "DMA error";
   if (ret_val == WS2811_ERROR_ILLEGAL_GPIO) return  "Selected GPIO not possible";
   if (ret_val == WS2811_ERROR_PCM_SETUP) return  "Unable to initialize PCM";
   if (ret_val == WS2811_ERROR_SPI_SETUP) return  "Unable to initialize SPI";
   if (ret_val == WS2811_ERROR_SPI_TRANSFER) return  "SPI transfer error";
}


Napi::Value Configure(const Napi::CallbackInfo & info) {
  Napi::Env env = info.Env();


  if (info.Length() != 1) {
    throw Napi::Error::New(env, "Configure must be called with an options object");
  }

  Napi::Object options = info[0].As<Napi::Object>();

    ws2811.freq = DEFAULT_TARGET_FREQ;
    ws2811.dmanum = DEFAULT_DMA;

    ws2811.channel[0].gpionum = DEFAULT_GPIO_PIN;
    ws2811.channel[0].count = 929990;
    ws2811.channel[0].invert = 0;
    ws2811.channel[0].brightness = 255;
    ws2811.channel[0].strip_type = DEFAULT_TYPE;
    ws2811.channel[0].gamma = gammaCorrection;

    ws2811.channel[1].gpionum = 0;
    ws2811.channel[1].count = 0;
    ws2811.channel[1].invert = 0;
    ws2811.channel[1].brightness = 0;
    ws2811.channel[1].strip_type = 0;

  if (options.Has("leds") && options.Get("leds").IsNumber()) {
    uint32_t leds = options.Get("leds").ToNumber().Uint32Value();
    ws2811.channel[0].count = leds;
  } else {
    throw Napi::Error::New(env, "Invalid option passed to configure(): `leds` must be a number");
  }

  if (options.Has("gpio") && options.Get("gpio").IsNumber()) {
    uint32_t gpio = options.Get("gpio").ToNumber().Uint32Value();
    ws2811.channel[0].gpionum = gpio;
  } else {
    throw Napi::Error::New(env, "Invalid option passed to configure(): `gpio` must be a number");
  }
//
  if (options.Has("dma")) {
    if (!options.Get("dma").IsNumber()) {
      throw Napi::Error::New(env, "Invalid option passed to configure(): `dma` must be a number");
    }
    uint32_t dma = options.Get("dma").ToNumber().Uint32Value();
    ws2811.dmanum = dma;
  }

  if (options.Has("brightness")) {
    if (!options.Get("brightness").IsNumber()) {
      throw Napi::Error::New(env, "Invalid option passed to configure(): `brightness` must be a number");
    }
    float brightness = options.Get("brightness").ToNumber().FloatValue();
    if (brightness > 1 || brightness < 0) {
      throw Napi::Error::New(env, "Invalid option passed to configure(): `brightness` must be between 0 and 1");
    }
    ws2811.channel[0].brightness = (int)(brightness * 255);
  }

  if (options.Has("type")) {
    if (!options.Get("type").IsNumber()) {
      throw Napi::Error::New(env, "Invalid option passed to configure(): `type` must be a number");
    }

    uint32_t strip_type = options.Get("type").ToNumber().Uint32Value();

		ws2811.channel[0].strip_type = strip_type;
  }

  ws2811_return_t result = ws2811_init(&ws2811);

  if (result) {
    Napi::Error::New(env, "Configuring ws281x failed: "+getErrorMessage(result)).ThrowAsJavaScriptException();
  }
  return env.Undefined();
}

Napi::Value Render(const Napi::CallbackInfo & info) {
  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::Error::New(env, "Expected a single Uint32Array argument").ThrowAsJavaScriptException();
    return env.Undefined();
  }

  Napi::TypedArray typedArray = info[0].As<Napi::TypedArray>();

  if (typedArray.TypedArrayType() != napi_uint32_array) {
    Napi::Error::New(env, "Expected an Uint32Array")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  Napi::Uint32Array uint32Array = typedArray.As<Napi::Uint32Array>();

	// Copy to std::vector<uint32_t>:
  std::vector<uint32_t> pixels(uint32Array.Data(),
                             uint32Array.Data() + uint32Array.ElementLength());

  for (int i = 0; i < ws2811.channel[0].count; i++) {
      ws2811.channel[0].leds[i] = pixels[i];
  }
  ws2811_render(&ws2811);

  return env.Undefined();

}

Napi::Value Reset(const Napi::CallbackInfo & info) {
  Napi::Env env = info.Env();
  memset(ws2811.channel[0].leds, 0, sizeof(uint32_t) * ws2811.channel[0].count);
  ws2811_render(&ws2811);
	ws2811_fini(&ws2811);

	return Napi::Boolean::New(env, true);
}
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "configure"),
    Napi::Function::New(env, Configure));

  exports.Set(Napi::String::New(env, "render"),
    Napi::Function::New(env, Render));

  exports.Set(Napi::String::New(env, "reset"),
    Napi::Function::New(env, Reset));

  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
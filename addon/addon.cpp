#include <napi.h>

// Expose synchronous and asynchronous access to our
// Estimate() function
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)

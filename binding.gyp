{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon/addon.cpp",
        "addon/rpi_ws281x/ws2811.c",
        "addon/rpi_ws281x/pwm.c",
        "addon/rpi_ws281x/dma.c",
        "addon/rpi_ws281x/mailbox.c",
        "addon/rpi_ws281x/rpihw.c",
        "addon/rpi_ws281x/pcm.c"
      ],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'conditions': [
        ['OS=="win"', {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1
            }
          }
        }],
        ['OS=="mac"', {
          "xcode_settings": {
            "CLANG_CXX_LIBRARY": "libc++",
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
            'MACOSX_DEPLOYMENT_TARGET': '10.7'
          }
        }]
      ]
    }
  ]
}

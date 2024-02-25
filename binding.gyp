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
      "ldflags":["-lrt"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"]
    }
  ]
}

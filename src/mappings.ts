export function alternatingMatrixMapping({height, width}: {height: number; width: number}): Uint32Array {
  const mapping = new Uint32Array(width * height)

  for (let i = 0; i < mapping.length; i++) {
    const row = Math.floor(i / width),
      col = i % width

    if (row % 2 === 0) {
      mapping[i] = i
    } else {
      mapping[i] = (row + 1) * width - (col + 1)
    }
  }
  return mapping
}

export function matrixMapping({height, width}: {height: number; width: number}): Uint32Array {
  const mapping = new Uint32Array(width * height)

  for (let i = 0; i < mapping.length; i++) {
    mapping[i] = i
  }
  return mapping
}

export function clear(pixels: number): Uint32Array {
  const mapping = new Uint32Array(pixels)

  for (let i = 0; i < mapping.length; i++) {
    mapping[i] = 0
  }
  return mapping
}

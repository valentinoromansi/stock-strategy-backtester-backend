export async function waitFor(sec: number): Promise<boolean> {
  console.log(`Waiting for ${sec} sec`)
  return await new Promise((r) => {
    setTimeout(() => {
      r(true)
    }, sec * 1000)
  })
}

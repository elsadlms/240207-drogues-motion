export const loadModule = async () => {
  let componentPromise

  if (import.meta.env.VITE_MODULE === 'motion') {
    componentPromise = import('~/modules/motion/Index.svelte')
  }

  if (import.meta.env.VITE_MODULE === 'anim-svg') {
    componentPromise = import('~/modules/anim-svg/Index.svelte')
  }

  const component = await componentPromise
  return component.default
}

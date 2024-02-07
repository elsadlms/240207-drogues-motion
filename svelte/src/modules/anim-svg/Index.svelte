<script>
  import { onMount } from 'svelte'
  import { clamp, interpolate } from '~/utils'

  export let progression

  const backgroundImage =
    'https://assets-decodeurs.lemonde.fr/redacweb/240207-drogues-motion-map/map-background.png'

  let pathElement
  let lineLength

  onMount(() => {
    if (pathElement) {
      lineLength = pathElement.getTotalLength()
    }
  })

  $: clampedProgression = clamp(progression, 0, 1)


  const circleRadius = 8
  $: firstCircleRadius = interpolate(
    Math.min(clampedProgression / 0.02, 1),
    0,
    circleRadius
  )
  $: secondCircleRadius = interpolate(
    Math.max((clampedProgression - 0.98) / 0.02, 0),
    0,
    circleRadius
  )

  $: firstLabelProgression = interpolate(
    Math.min(Math.max((clampedProgression - 0.04) / (0.12 - 0.04), 0), 1),
    0,
    1
  )
  $: secondLabelProgression = interpolate(
    Math.min(Math.max((clampedProgression - 0.92) / (1 - 0.92), 0), 1),
    0,
    1
  )

  $: inlineStyle = [
    `--first-label-progression: ${firstLabelProgression};`,
    `--second-label-progression: ${secondLabelProgression};`,
    `--stroke-dasharray: ${lineLength} ${lineLength};`,
    `--stroke-dashoffset: ${lineLength - lineLength * clampedProgression};`,
  ]
</script>

<div class="container" style={inlineStyle.join(' ')}>
  <img src={backgroundImage} class="background-image" alt="" />

  <svg
    width="1920"
    height="1080"
    viewBox="0 0 1920 1080"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      bind:this={pathElement}
      d="M491 938.5L460 861.5L464 855L517 848.5L603 735L617.5 743C710 646 990.5 477.5 1145 433.5L1235.5 292L1296 270.5L1374.5 252L1570 224L1579 218.5V213L1593 199.5L1604.5 193H1611.5L1600.5 191.5L1590.5 194.5H1583L1574.5 201.5H1567V200.5H1574.5L1583 193.5H1590.5L1616 175.5L1625.5 160.5L1665.5 149.5C1670.17 148.667 1679.7 148.2 1680.5 153C1682.67 151.833 1687.7 150.9 1690.5 156.5"
      stroke="#FFFFFF"
      stroke-width="1" />
    <circle cx="491" cy="938.5" r={firstCircleRadius} fill="#FF0000" />
    <rect class="label-background label-background--first" x="342" y="860" width="300" height="60" fill="#000000" />
    <text class="label-text label-text--first" x="491" y="900" text-anchor="middle" alignment-baseline="baseline">
      Buenaventura
    </text>
    <circle cx="1690.5" cy="156.5" r={secondCircleRadius} fill="#FF0000" />
    <rect class="label-background label-background--second" x="1575" y="80" width="228" height="60" fill="#000000" />
    <text class="label-text label-text--second" x="1690.5" y="120" text-anchor="middle" alignment-baseline="baseline">
      Hambourg
    </text>
  </svg>
</div>

<style lang="scss">
  .container {
    display: grid;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    > * {
      grid-area: 1/-1;
    }

    svg,
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    svg path {
      stroke-dasharray: var(--stroke-dasharray);
      stroke-dashoffset: var(--stroke-dashoffset);
    }

    svg text {
      background-color: #000;
      fill: #fff;
      text-transform: uppercase;
      font-family: var(--ff-marr-sans);
      font-weight: 600;
      letter-spacing: 1px;
      font-size: 32px;
    }
  }

  .label-text.label-text--first {
    opacity: var(--first-label-progression);
    transform: translateY(calc(24px * (1 - var(--first-label-progression))));
  }

  .label-background.label-background--first {
    opacity: var(--first-label-progression);
    width: calc(var(--first-label-progression) * 300px);
  }

  .label-text.label-text--second {
    opacity: var(--second-label-progression);
    transform: translateY(calc(24px * (1 - var(--second-label-progression))));
  }

  .label-background.label-background--second {
    opacity: var(--second-label-progression);
    width: calc(var(--second-label-progression) * 228px);
  }
</style>

import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import { parsed, lookup } from '../scripts/parser'
import lodash from 'lodash'

const gameParams = parsed.game.params

const config = {
  type: lookup(gameParams, 'type'),
  backgroundColor: lookup(gameParams, 'background-color'),
  scale: {
    parent: lookup(gameParams, 'scale.parent'),
    mode: lookup(gameParams, 'scale.mode'),
    autoCenter: lookup(gameParams, 'scale.auto-center'),
    width: lookup(gameParams, 'scale.width'),
    height: lookup(gameParams, 'scale.height')
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: lookup(gameParams, 'physics.default'),
    arcade: {
      debug: lookup(gameParams, 'physics.debug'),
      gravity: {
        x: lookup(gameParams, 'physics.gravity.x'),
        y: lookup(gameParams, 'physics.gravity.y')
      }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})

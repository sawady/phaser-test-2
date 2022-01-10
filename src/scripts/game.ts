import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import { parsed, lookup, lookupExpr } from '../scripts/parser'
import lodash from 'lodash'

const gameParams = parsed.game.params
const preloadSceneActions = parsed.scenes[0].actions
  .filter(action => action.name === 'preload')
  .map(action => action.params)

const preloadImages = preloadSceneActions.map(action => ({
  type: lookup(action, 'type'),
  name: lookup(action, 'name'),
  value: lookup(action, 'type')
}))

console.log(preloadImages)

const config = {
  type: lookupExpr(gameParams, 'type'),
  backgroundColor: lookupExpr(gameParams, 'background-color'),
  scale: {
    parent: lookupExpr(gameParams, 'scale.parent'),
    mode: lookupExpr(gameParams, 'scale.mode'),
    autoCenter: lookupExpr(gameParams, 'scale.auto-center'),
    width: lookupExpr(gameParams, 'scale.width'),
    height: lookupExpr(gameParams, 'scale.height')
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: lookupExpr(gameParams, 'physics.default'),
    arcade: {
      debug: lookupExpr(gameParams, 'physics.debug'),
      gravity: {
        x: lookupExpr(gameParams, 'physics.gravity.x'),
        y: lookupExpr(gameParams, 'physics.gravity.y')
      }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})

import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import Parser from '../parser'

export default class MainScene extends Phaser.Scene {
  fpsText: FpsText

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0)

    this.add.text(15, this.cameras.main.height / 2, JSON.stringify(Parser.parse('[state hola] trigger = time')), {
      color: '#000000',
      fontSize: '24px'
    })
  }

  update() {
    this.fpsText.update()
  }
}

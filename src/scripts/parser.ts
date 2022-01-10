import * as peggy from 'peggy'
import lodash from 'lodash'

const parser = peggy.generate(
  `
Game
	= game:GameInfo scenes:Scene* _ { return { game, scenes } }

GameInfo
  = _ "[" _ "game" _ "]" params: Param* { return { params } }

Scene
  = _ "[" _ "scene" _ scene:string _ "]" params: Param* actions: Action* objects:Object* { return { scene, params, actions, objects } }

Preload
  = _ "[" _ "preload" _ name:string _ "]" params:Param* { return { name, params } }

Object
  = _ "[" _ "object" _ object:string _ "]" params: Param* states:State* { return { object, params, states } }

State
  = _ "[" _ "state" _ state:string _ "]" params: Param* actions:Action* { return { state, params, actions } }

Action
  = _ "[" _ "action" _ name:string _ "]" params:Param* { return { name, params } }

Param
  = _ name:string _ "=" _ expr:additive { return { name, expr } }

additive
  = _ left:multiplicative _ op:("+"/"-") _ right:additive { return { exp1: left, op, exp2: right }; }
  / multiplicative

multiplicative
  = _ left:primary _ op:("*"/"/") _ right:multiplicative { return { exp1: left, op, exp2: right }; }
  / primary

primary
  = op:("-") "(" expr:additive ")" { return { op, exp1: expr } }
  / op:("-") expr:primary { return { op, exp1: expr } }
  / op:("!") "(" expr:additive ")" { return { op, exp1: expr } }
  / op:("!") expr:primary { return { op, exp1: expr } }
  / op:string "(" expr:additive _ ")" { return { op, exp: expr } } 
  / expr:integer
  / expr:string

integer "integer"
  = digits:[0-9]+ { return parseInt(text().trim(), 10); }

string "string"
  = [ .#_a-z-A-Z]+ [0-9]* { return text().trim(); }

_ "whitespace"
  = [ \\t\\n\\r]*
`,
  { optimize: 'speed' }
)

const parsed = parser.parse(
  `
  [game]
  type = Phaser.AUTO
  background-color = #ffffff
  scale.parent = phaser-game
  scale.mode = Phaser.Scale.FITf
  scale.auto-center = Phaser.Scale.CENTER_BOTH
  scale.width = 1280
  scale.height = 720
  physics.default = arcade
  physics.debug  = true
  physics.gravity.x = 0
  physics.gravity.y = 100
  
  [scene preload]

  [action preload]
  type = image
  name = phaser-logo
  value = assets/img/phaser-logo.png

  [scene main]

  [object logo]

  [state boundcing]
  spite = phaser-logo
  
  [action vel-set]
  x = 100
`
)

console.log(parsed)

const lookupExpr = (obj: any, name: string) => lodash.find(obj, { name })?.expr

const lookup = (obj: any, name: string) => lodash.find(obj, { name })?.expr

export { parser, parsed, lookupExpr, lookup }

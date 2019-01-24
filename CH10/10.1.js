/*
These are the bindings that the project from Chapter 7 creates:

roads
buildGraph
roadGraph
VillageState
runRobot
randomPick
randomRobot
mailRoute
routeRobot
findRoute
goalOrientedRobot

If you were to write that project as a modular program, what modules would you
create ? Which module would depend on which other module, and what would their
interfaces look like ? Which pieces are likely to be available pre - written on
NPM ? Would you prefer to use an NPM package or to write them yourself ?
*/

/*
  Modules:

      Graph
          Dependencies: buildGraph
          Interface: buildGraph(edges) return graph;

      Village
          Dependencies: VillageState
          Interface: move(destination) return VillageState
                     random(VillageState) return VillageState

      Robot
          Dependencies: runRobot, randomPick, routeRobot, goalOrientedRobot, findRoute
          Interface: runRobot(state, robot, memory), tryRouteRobot(state, memory),
                      tryGoalOrientedRobot({place, parcels}, route)
*/

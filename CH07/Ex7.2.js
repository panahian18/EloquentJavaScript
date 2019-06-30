/*
Can you write a robot that finishes the delivery task faster than goalOrientedRobot
? If you observe that robot’s behavior, what obviously stupid things does
it do? How could those be improved?
If you solved the previous exercise, you might want to use your compareRobots
function to verify whether you improved the robot.
*/

function improvedGoalRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    let posR1 = findRoute(roadGraph, place, parcel.place);
    for (let i = 0; i < parcels.length; i++) {
      let posR2 = findRoute(roadGraph, place, parcels[i].place);
      if (posR2.length < posR1.length) {
        posR1 = posR2;
        parcel = parcels[i];
      }
      else if (posR1.length == posR2.length) {
        if ((findRoute(roadGraph, place, parcels[i].address).length) < (findRoute(roadGraph, place, parcel.address).length))
      	parcel = parcels[i];
      }

    }
    if (parcel.place != place)
      route = findRoute(roadGraph, place, parcel.place);
   else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
    return {direction: route[0], memory: route.slice(1)};
}

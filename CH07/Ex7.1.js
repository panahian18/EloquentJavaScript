/*
Write a function compareRobots which takes two robots (and their
starting memory). It should generate a hundred tasks, and let each
of the robots solve each of these tasks. When done, it should output the
average number of steps each robot took per task.
For the sake of fairness, make sure that you give each task to both
robots, rather than generating different tasks per robot
*/

function compareRobots(robot1, memory1, robot2, memory2) {
  let tasks = [];
  let steps1 = [];
  let steps2 = [];

  for (let i = 0; i < 100; i++) {
    tasks[i] = VillageState.random();
  }
  function runRobot(state, robot, memory) {
    for (let i = 0;; i++) {
      if (state.parcels.length == 0) {
      // console.log(`finished in an average of ${i} tasks`);

        return i;
     }
     let action = robot(state, memory);
     state = state.move(action.direction);
     memory = action.memory;
    }
  }
    for (let i = 1; i < tasks.length; i++) {
		steps1[i] = runRobot(tasks[i], robot1, memory1);
      	steps2[i] = runRobot(tasks[i], robot2, memory2);
    }
 let steps1Sum = steps1.reduce((x, y) => x + y);
 let steps1Avg = steps1Sum/steps1.length;
 let steps2Sum = steps2.reduce((x, y) => x + y);
 let steps2Avg = steps2Sum/steps2.length;

 console.log(`robot1 finished tasks in an average of ${steps1Avg} steps`);
 console.log(`robot2 finished tasks in an average of ${steps2Avg} steps`);
}

compareRobots(routeRobot, [], goalOrientedRobot, []);

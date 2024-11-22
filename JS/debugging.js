Module.callMain = callMain;

Module.dumpRegisteredTypes = function() {
  console.log("Registered types...");
  for (let [key, value] of Object.entries(registeredTypes)) {
      console.log(`  [${key}] = ${value.name}`)
  }
}

Module.dumpMethodCallers = function() {
  console.log("Method Callers...");
  for (let [key, value] of Object.entries(emval_methodCallers)) {
      console.log(`  [${key}] = ${value.name}`)
  }
}

 /**this code sets up real-time monitoring of the 'services' collection in a MongoDB database.
       * It logs errors and changes as they occur. This can be particularly useful in scenarios where you want your application to react immediately to changes in the database,
       * without having to poll or re-query the database. */
 const collection = serviceDB.collection('services');
 const changeStream = collection.watch();
 changeStream.on('error', (error) => {
    console.error('Error in ChangeStream:', error);
  // Handle the error appropriately, perhaps by closing and reopening the ChangeStream.
  });
 changeStream.on('change', (change) => {
   console.log(colors.bgCyan('Change detected:'), change);
   // Additional logic here if needed
 });
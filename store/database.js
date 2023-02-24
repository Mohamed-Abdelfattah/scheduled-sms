import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('smsReminder.db');
// console.log('after opening database', database);

/**configuration function to initialize the database with base structure to be executed once upon app start but also we must assert it was called at least once to have a probably configured db in place */
export async function init() {
  // console.log('@init --- before createTables');
  const results = await Promise.allSettled(
    createMessagesTable(),
    createEventsTable()
  );
  // console.log('@init --- after createTables ---', results);

  const errors = results
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason);

  if (errors.length) {
    // Aggregate all errors into one
    throw new AggregateError(errors);
  }

  return results.map((result) => result.value);
}

export function createMessagesTable() {
  // tx.executeSql(`CREATE TABLE IF NOT EXISTS users ()`);

  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // console.log(
      //   '@p1-messages -- before executeSql ---',
      //   tx ? tx : 'tx is undefined or null'
      // );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          recipients TEXT,
          sendingDate TEXT,
          rules TEXT
          )`,
        [],
        (_, resultSet) => {
          // console.log('transaction success -- results ---', resultSet);
          resolve();
        },
        (_, error) => {
          // console.log('transaction failed -- error ---', error.message);
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function createEventsTable() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY NOT NULL,
          state TEXT,
          sentOn TEXT,
          messageId INTEGER
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function addMessage(message) {
  const { title, content, rules, recipients } = message;

  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO messages (title, content, recipients, rules) VALUES (?, ?, ?, ?)`,
        [title, content, JSON.stringify(recipients), JSON.stringify(rules)],
        (_, result) => {
          console.log('@db inserting message --- success', result.insertId);
          resolve(result.insertId);
        },
        (_, error) => {
          console.log('@db inserting message --- error', error);
          reject(error);
        }
      );
    });
  });

  return promise;
}

/**function to update some fields in a message, will accept the id of the message to be updated and an object containing only the fields to be updated */
export function editMessage(messageId, newMessage) {
  let sql = 'UPDATE messages SET ';
  const values = [];
  // iterate over the messages fields to be updated to add them to the query statement and to arguments array
  for (const [key, value] of Object.entries(newMessage)) {
    sql += key + ' = ?, ';
    values.push(value);
  }
  // remove extra comma and space from sql statement and add WHERE clause
  sql = sql.slice(0, -2) + ' WHERE id = ?';
  // push id as the last argument to the query
  values.push(messageId);

  console.log("'" + sql + "'");
  console.log('values', values);

  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        sql,
        values,
        (_, result) => {
          console.log('@db inserting message --- success', result);
          resolve(result);
        },
        (_, error) => {
          console.log('@db inserting message --- error', error);
          reject(error);
        }
      );
    });
  });

  return promise;
}

// in case of a new message or a resend (repeat sending message) a new event should be added, the event will convert to success in case the user pressed on the notification and got was directed to the phone's send message interface
export function addEvent(messageId, sendingDate) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO events (state, messageId, sentOn) VALUES ('scheduled', ?, ?)`,
        [+messageId, sendingDate],
        (_, result) => {
          console.log('@db inserting events --- success', result);
          resolve(result);
        },
        (_, error) => {
          console.log('@db inserting events --- error', error);
          reject(error);
        }
      );
    });
  });

  return promise;
}

/**to change the sending date of an upcoming event */
export function editEvent(eventId, newSendingDate) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE events SET sentOn = ? WHERE id = ?`,
        [newSendingDate, eventId],
        (_, result) => {
          console.log('@db editing events --- success', result);
          resolve(result);
        },
        (_, error) => {
          console.log('@db editing events --- error', error);
          reject(error);
        }
      );
    });
  });

  return promise;
}

/**to change the event state into success, fail or warning -- will accept id to update specific event and the new state to update the event with */
export function updateEvent(eventId, newState) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE events SET state = ? WHERE id = ?`,
        [newState, eventId],
        (_, result) => {
          console.log('@db updating events --- success', result);
          resolve(result);
        },
        (_, error) => {
          console.log('@db updating events --- error', error);
          reject(error);
        }
      );
    });
  });

  return promise;
}

/**function to get all the app data that was stored in the db --- will return a promise that resolves to an array of fetching results or throws an aggregateError that contains all errors if any */
export async function getAppData() {
  // getMessages()
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err))
  //   .finally(() => console.log('promise fulfilled'));
  console.log('@database @getAppData --- before getting messages --');
  const results = await Promise.allSettled([getMessages(), getEvents()]);
  console.log('@database @getAppData --- after getting messages');
  const errors = results
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason);

  if (errors.length) {
    throw new AggregateError(errors);
  }

  // return results.map((result) => result.value);
  const data = {};
  for (let i of results) {
    Object.assign(data, i.value);
  }
  return data;
}

export function getMessages() {
  // fetch messages
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages`,
        [],
        (_, results) => {
          console.log(
            '@db --- fetching messages --- results',
            results.rows._array
          );
          // should resolve with a format that can be accessed later to populate the state .. {messages:[{...messageData},{}]}
          const messages = results.rows._array;
          // the messages will have a recipients and rules columns which are JSON and so they need to be parsed before resolving the data
          if (messages.length) {
            for (const record of messages) {
              record.recipients = JSON.parse(record.recipients);
              record.rules = JSON.parse(record.rules);
            }
          }

          resolve({ messages });
        },
        (_, error) => {
          console.log('@db --- fetching messages --- error', error);
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function getEvents() {
  // fetch events
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM events`,
        [],
        (_, results) => {
          console.log(
            '@db --- fetching events --- results',
            results.rows._array
          );
          // should resolve with a format that can be accessed later to populate the state
          resolve({ events: results.rows._array });
        },
        (_, error) => {
          console.log('@db --- fetching events --- error', error);
          reject(error);
        }
      );
    });
  });

  return promise;
}

// /**configuration function to initialize the database with base structure to be executed once upon app start but also we must assert it was called at least once to have a probably configured db in place */
// export async function init() {
//   const results = await Promise.allSettled(createTables());

//   try {
//     const resultsArray = handleResults(results);
//     return resultsArray;
//   } catch (err) {
//     for (const error of err.errors) {
//       console.log('error occurred while creating table', error);
//     }
//   }
// }

// /**Generic function to throw if any errors occurred, or return the responses if no errors happened*/
// function handleResults(results) {
//   const errors = results
//     .filter((result) => result.status === 'rejected')
//     .map((result) => result.reason);

//   if (errors.length) {
//     // Aggregate all errors into one
//     throw new AggregateError(errors);
//   }

//   return results.map((result) => result.value);
// }

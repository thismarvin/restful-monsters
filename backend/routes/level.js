const express = require("express");
const errors = require("./common/errors.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();

// Gets all registered levels.
router.get("/levels", async (_, res) => {
    try {
        const result = await db.query(`SELECT * FROM levels;`);
        res.status(200).json(result);
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});

// // TODO: This should really be implemented with a query string, not an endpoint.
// // // Gets all levels from a specific creator.
// // router.get("/levels/:creator", async (req, res) => {
// //     try {
// //         const result = await db.query(`SELECT * FROM v_levels WHERE creator='${req.params.creator}';`);

// //         if (result.length === 0) {
// //             errors.sendNotFound(res, "Could not find any levels from that creator.");
// //             return;
// //         }

// //         res.status(200).json(result);
// //     } catch (error) {
// //         switch (error.code) {
// //             default:
// //                 errors.handle(res, error);
// //                 break;
// //         }
// //     }
// // });

// // Creates a level.
// router.post("/levels", async (req, res) => {
//     /**
//      * example_request = {
//      *  creator: thismarvin,
//      *  name: World 1 - 1,
//      *  description: Have fun you guys!,
//      *  data: {
//      *      "blocks": "5.1,1.1A"
//      *  }
//      * }
//      */

//     if (!req.body.creator || !req.body.name || !req.body.description || !req.body.data) {
//         errors.sendBadRequest(res, "Invalid request body.");
//         return;
//     }

//     const formatData = data => {
//         let result = data.replace(/'/g, `"`);
//         const keys = result.match(/\w+\s*:/g);

//         for (let key of keys) {
//             result = result.replace(key, `"${key.substring(0, key.length - 1)}":`);
//         }

//         return result;
//     };

//     try {
//         const insertIntoLevels = `
//         INSERT INTO levels
//         (name, description, date_created, time_created)
//         VALUES (
//         "${req.body.name}",
//         "${req.body.description}",
//         CURDATE(),
//         CURTIME()
//         );
//         `;
//         await db.query(insertIntoLevels)

//         db.enqueue(`SELECT id FROM users WHERE login="${req.body.creator}";`);
//         db.enqueue(`SELECT id FROM levels WHERE name="${req.body.name}";`);
//         const [users, levels] = await db.run();

//         const creatorID = users[0].id;
//         const levelID = levels[0].id;
//         const formattedData = formatData(req.body.data);

//         const insertIntoUserLevels = `
//         INSERT INTO user_levels
//         (user_id, level_id)
//         VALUES (
//         ${creatorID},
//         ${levelID}
//         );
//         `;

//         const insertIntoLevelData = `
//         INSERT INTO level_data
//         (level_id, data)
//         VALUES (
//         ${levelID},
//         '${formattedData}'
//         );
//         `;

//         db.enqueue(insertIntoUserLevels);
//         db.enqueue(insertIntoLevelData);
//         await db.run();

//         const result = await db.query(`SELECT * FROM v_levels WHERE id="${levelID}";`);
//         res.status(201).json(result);

//     } catch (error) {
//         switch (error.code) {
//             case "ER_DUP_ENTRY":
//                 errors.sendConflict(res, "A level with that name already exists.");
//                 break;
//             case "ER_INVALID_JSON_TEXT":
//                 errors.sendBadRequest(res, "The level data that was provided was not formatted correctly. Make sure to use valid JSON syntax.");
//                 break;
//             default:
//                 errors.handle(res, error);
//                 break;
//         }
//     }
// });

// router.get("/levels/:id", async (req, res) => {
//     try {
//         const result = await db.query(`SELECT * FROM v_levels WHERE id=${req.params.id};`);

//         if (result.length === 0) {
//             errors.sendNotFound(res, "Could not find a level with that id.");
//             return;
//         }

//         res.status(200).json(result);
//     } catch (error) {
//         switch (error.code) {
//             default:
//                 errors.handle(res, error);
//                 break;
//         }
//     }
// });

// // Req must send everything.
// router.put("/levels/:id", async (req, res) => {
//     if (!req.body.creator || !req.body.name || !req.body.description || !req.body.data) {
//         errors.sendBadRequest(res, "Invalid request body.");
//         return;
//     }

//     const formatData = data => {
//         let result = data.replace(/'/g, `"`);
//         const keys = result.match(/\w+\s*:/g);

//         for (let key of keys) {
//             result = result.replace(key, `"${key.substring(0, key.length - 1)}":`);
//         }

//         return result;
//     };

//     try {
//         const updateLevels = `
//         UPDATE levels
//         SET
//         name = "${req.body.name}",
//         description = "${req.body.description}"
//         WHERE id = ${req.params.id}
//         ;
//         `;
//         await db.query(updateLevels)

//         db.enqueue(`SELECT id FROM users WHERE login="${req.body.creator}";`);
//         const [users] = await db.run();

//         const creatorID = users[0].id;
//         const formattedData = formatData(req.body.data);

//         const updateUserLevels = `
//         UPDATE user_levels
//         SET
//         user_id = ${creatorID}
//         WHERE level_id = ${req.params.id}
//         ;
//         `;

//         const updateLevelData = `
//         UPDATE level_data
//         SET
//         data = '${formattedData}'
//         WHERE level_id = ${req.params.id}
//         ;
//         `;

//         db.enqueue(updateUserLevels);
//         db.enqueue(updateLevelData);
//         await db.run();

//         const result = await db.query(`SELECT * FROM v_levels WHERE id="${req.params.id}";`);
//         res.status(201).json(result);

//     } catch (error) {
//         switch (error.code) {
//             case "ER_INVALID_JSON_TEXT":
//                 errors.sendBadRequest(res, "The level data that was provided was not formatted correctly. Make sure to use valid JSON syntax.");
//                 break;
//             default:
//                 errors.handle(res, error);
//                 break;
//         }
//     }
// });

// // Req does not have to update everything.
// router.patch("/levels/:id", async (req, res) => {
//     try {
//         // TODO: Implement 😉
//     } catch (error) {
//         switch (error.code) {
//             default:
//                 errors.handle(res, error);
//                 break;
//         }
//     }
// });

// router.delete("/levels/:id", async (req, res) => {
//     try {
//         // Will this cascade?
//         await db.query(`DELETE FROM user_levels WHERE id=${req.params.id};`);

//         res.status(204).json({
//             "message": "Successfully deleted level."
//         });
//     } catch (error) {
//         switch (error.code) {
//             default:
//                 errors.handle(res, error);
//                 break;
//         }
//     }
// });

module.exports = router;
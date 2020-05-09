const router = require("express").Router();
const coachDB = require("../../models/coach-models");
const helper = require("../../utils/coachMeHelpers");

/* MIDDLEWARE */
router.use("/:id", require("../../middleware/pathValidator").checkID);

/*  
	'/coach'
	This endpoint retrieves all the coaches 
	registered in the database.
*/
router.get("/", async (req, res) => {
	try {
		res.status(200).json(await coachDB.getCoachList());
	} catch (error) {
		helper.catchError(res, error);
	}
});

/*  
	GET
	'/coach/:id'
	This endpoint retrieves a specific coach by their user id.
*/
router.get("/:id", async (req, res) => {
	try {
		res.status(200).json(await coachDB.getUserById(req.params.id, "coach"));
	} catch (error) {
		helper.catchError(res, error);
	}
});

/*  
	PUT
	'/coach/:id'
	This endpoint retrieves a specific coach by their user id
	and allows them to update their information.
*/
router.put("/:id", async (req, res) => {
	try {
		const changes = req.body;
		res.json(await coachDB.updateCoachByID(req.params.id, changes));
	} catch (error) {
		helper.catchError(res, error);
	}
});

/*  
	DELETE
	'/coach/:id'
	This endpoint retrieves a specific coach by their user id
	and allows them to delete their account.
*/

/*  
	GET
	'/coach/:id/clients'
	This endpoints retrieves all the clients that have
	been assigned to this coaches user ID.
*/
router.get("/:id/clients", async (req, res) => {
	try {
		res.status(200).json(await coachDB.getClientListByCoachID(req.params.id));
	} catch (error) {
		helper.catchError(res, error);
	}
});

/*
	GET
	'/coach/:id/clients/:clientID'
	This endpoint retrieves a specific client by
	their ID that belongs to a specific coach ID
*/
router.get("/:id/clients/:clientID", async (req, res) => {
	try {
		res
			.status(200)
			.json(
				await coachDB.getCoachClientByID(req.params.id, req.params.clientID)
			);
	} catch (error) {
		helper.catchError(res, error);
	}
});

/*  
	GET
	'/coach/:id/clients/:clientID/sessions'
	This route retrieves the specific client sessions belonging
	to a specific coach.
*/
router.get("/:id/clients/:clientID/sessions", async (req, res) => {
	try {
		res
			.status(200)
			.json(
				await coachDB.getCoachSessionsByClientID(
					req.params.id,
					req.params.clientID
				)
			);
	} catch (error) {
		helper.catchError(res, error);
	}
});

/*  
	POST
	'/coach/:id/clients/:clientID/sessions'
*/
router.post("/:id/clients/:clientID/sessions", async (req, res) => {
	try {
		const { session_date, notes } = req.body;
		console.log("session_date: ", session_date);
		console.log("notes: ", notes);
		if (!session_date || !notes) {
			res.status(400).json({
				message: "Need session_date and notes",
			});
		}
		const payload = {
			session_date: session_date,
			notes: notes,
			coach_id: req.params.id,
			client_id: req.params.clientID,
		};
		res.status(201).json(await coachDB.addClientSession(payload));
	} catch (error) {
		helper.catchError(res, error);
	}
});

/*	
	GET
	'/coach/:id/sessions'
	This endpoint retrieves all sessions that belong to
	a specific coaches ID.
*/
router.get("/:id/sessions", async (req, res) => {
	try {
		res.status(200).json(await coachDB.getCoachSessionsByID(req.params.id));
	} catch (error) {
		helper.catchError(res.error);
	}
});

/* 
	GET
	'/coach/:id/sessions/:sessionID'
*/
router.get("/:id/sessions/:sessionID", async (req, res) => {
	try {
		res
			.status(200)
			.json(
				await coachDB.getCoachingSession(
					req.params.sessionID,
					req.params.id,
					"coach"
				)
			);
	} catch (error) {
		helper.catchError(res, error);
	}
});

/* 
	PUT
	'/coach/:id/sessions/:sessionID'
*/
router.put("/:id/sessions/:sessionID", async (req, res) => {
	try {
		const { session_date, notes } = req.body;
		console.log("session_date: ", session_date);
		console.log("notes: ", notes);

		if (!session_date || !notes) {
			res.status(400).json({
				message: "Need session_date and notes",
			});
		}

		const payload = {
			session_date: session_date,
			notes: notes,
		};

		res.json(await coachDB.updateSessionByID(req.params.sessionID, payload));
	} catch (error) {
		helper.catchError(res, error);
	}
});

module.exports = router;

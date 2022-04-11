const { response } = require("express");
const mongoose = require("mongoose");
const MOVIES = mongoose.model(process.env.MOVIES_MODEL);

const getAll = (req, res) => {

    console.log("Get All Actors by Movie Controller");
    let movieId;
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    if (req.params && req.params.movieId) {
        movieId = req.params.movieId;
        if (!mongoose.isValidObjectId(movieId)) {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid movieId";
        }
    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "Cannot find without movieId";
    }

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).select("actors").exec((err, movie) => _findMovieByIdAndReturnResponse(err, movie, response, res));
    }
};

const getOne = (req, res) => {

    const { movieId, actorId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE && response.status != process.env.HTTP_CREATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).exec((err, movie) => {
            if (err) {
                res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(response.message);
            } else {
                let actor = movie.actors.id(actorId);
                if (actor) {
                    res.status(process.env.HTTP_READ_STATUS_CODE).json(actor);
                } else {
                    res.status(process.env.HTTP_NOT_FOUND_STATUS_CODE).json(`Actor with given id: ${actorId} not found`);
                }
            }

        });
    }
};

const addOne = (req, res) => {
    console.log("Add One Actor Controller");
    const { movieId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {

        MOVIES.findById(movieId).select("actors").exec(function (err, movie) {
            response.status=process.env.HTTP_UPDATE_STATUS_CODE;
            console.log("Found movie ", movie);
            if (err) {
                console.log("Error finding movie");
                response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
                response.message = err;
            } else if (!movie) {
                console.log("Movie with given Id not found " + movieId);
                response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
                response.message = `Movie with given Id not found ${movieId}`;
            }
            if (movie) {
                _addActor(req, res, movie, response);
            } else {
                res.status(response.status).json(response.message);
            }
        });
    }


};

const updateOne = (req, res) => {
    const { movieId, actorId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);
    console.log(movieId, actorId, response);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).exec((err, movie) => _updateActor(err, req, movie, res));
    }

};

const deleteOne = (req, res) => {
    const { movieId, actorId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).exec((err, movie) => _deleteActor(err, movie, req, res));
    }
};

const _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse = (req) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    const { movieId, actorId } = req.params;

    if (req.params && movieId) {
        if (!mongoose.isValidObjectId(movieId)) {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid movieId";
        }
    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "Cannot find without movieId";
    }

    if (req.params && actorId) {
        if (!mongoose.isValidObjectId(actorId)) {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid actorId";
        }
    }

    return {
        movieId: movieId,
        actorId: actorId,
        response: response
    };
};
const _addActor = (req, res, movie, response) => {
    console.log(req.body);
    const { name, awards } = req.body;
    if (name) {
        if (isNaN(name)) {
            movie.actors.name = name;
        } else {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid input name must be a string";
        }

    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "Invalid input name cannot be null";
    }

    if (awards) {
        if (isNaN(awards)) {
            console.log("Year cannot be a string");
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid input, String not allowed for year";
        } else {
            movie.actors.awards = parseInt(awards, 10);
        }
    }

    let newActor = {
        name: name,
        awards: awards
    };

    if (response.status != process.env.HTTP_CREATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {

        movie.actors.push(newActor);

        movie.save(function (err, movie) {
            if (err) {
                response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
                res.status(response.status).json(err);

            } else {
                response.status = process.env.HTTP_CREATE_STATUS_CODE;
                response.message =movie.actors;
                res.status(response.status).json(response.message);
            }
           
        });
    }
};

const _updateActor = (err, req, movie, res) => {
    if (err) {
        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
    } else {
        let actor = movie.actors.id(req.params.actorId);
        if (actor) {
            actor.name = req.body.name;
            actor.awards = req.body.awards;
            movie.save((err) => {
                if (err) res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
                res.status(process.env.HTTP_UPDATE_STATUS_CODE).json("update successful");
            });
        }
    }
};

const _deleteActor = (err, movie, req, res) => {
    if (err) {
        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
    } else {
        let actor = movie.actors.id(req.params.actorId);
        if (actor) {
            actor.remove();
            movie.save(function (err, resp) {
                if (err) res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
                else res.status(process.env.HTTP_DELETE_STATUS_CODE).json("Actor deleted successfully");
            });
        } else {
            res.status(process.env.HTTP_NOT_FOUND_STATUS_CODE).json(`Actor with given id: ${actorId} not found`);
        }
    }

};

const _findMovieByIdAndReturnResponse = (err, movie, response, res) => {
    if (err) {
        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
    } else {
        res.status(response.status).json(movie);
    }
};

module.exports = {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteOne
};
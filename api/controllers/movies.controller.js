const mongoose = require("mongoose");
const MOVIES = mongoose.model(process.env.MOVIES_MODEL);

const getAll = (req, res) => {
    console.log("Get All Movies Controller");
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };

    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET, 10);
    let count = parseInt(process.env.DEFAULT_FIND_COUNT, 10);
    let max = parseInt(process.env.MAX_FIND_COUNT, 10);


    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if (isNaN(offset) || isNaN(count)) {
        console.log("Offset or Count is not a number");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "offset and count must be digit";
    }

    if (count > max) {
        console.log("Count greater than max");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "Count cannot be greater than " + max;
    }

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json({ status: "failed", msg: response.message });
    } else {
        MOVIES.find().skip(offset).limit(count).exec((err, movies) => _getAllMoviesAndReturnResponse(err, movies, response, res));

    }


};

const addOne = (req, res) => {
    const response = {
        status: process.env.HTTP_CREATE_STATUS_CODE,
        message: {}
    };

    let newMovie = {};

    newMovie.title = req.body.title;
    newMovie.year = parseInt(req.body.year, 10);

    if (req.body.actors) {
        newMovie.actors = req.body.actors;
    } else {
        newMovie.actors = [];
    }

    if (isNaN(newMovie.year)) {
        console.log("Year cannot be a string");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "Invalid input, String not allowed for year";
    }

    if (response.status != process.env.HTTP_CREATE_STATUS_CODE) {
        res.status(response.status).json({ status: "failed", msg: response.message });
    } else {
        MOVIES.create(newMovie, (err, savedMovie) => _saveNewMovieAndSendResponse(err, savedMovie, response, res));
    }
};

const getOne = (req, res) => {
    console.log("Get One Movie Controller");
    const { movieId, response } = _validateMovieIdFromReqAndReturnMovieIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json({ status: "failed", msg: response.message });
    } else {
        MOVIES.findById(movieId).exec((err, movie) => _findMovieByIdAndReturnResponse(err, movie, response, res));
    }
};

const _updateOne = (req, res, updateMoviecallBack) => {
    console.log("Update One  controller");

    const { movieId, response } = _validateMovieIdFromReqAndReturnMovieIdAndResponse(req);
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {

        res.status(response.status).json(response.message);

    } else {
        MOVIES.findById(movieId).exec(function (err, movie) {
            const response = { status: process.env.HTTP_CREATE_STATUS_CODE, message: movie };
            if (err) {
                console.log("Error finding movie");
                response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
                response.message = { status: "failed", message: err };
            } else if (!movie) {
                console.log("movie with given id not found");
                response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
                response.message = { status: "failed", message: "movie with given id not found" };
            }
            if (response.status !== process.env.HTTP_CREATE_STATUS_CODE) {
                res.status(response.status).json(response.message);
            } else {
                updateMoviecallBack(req, res, movie, response);
            }
        });
    }
};

const partialUpdateOne = (req, res) => {
    movieUpdate = function (req, res, movie, response) {
        movie.title = req.body.title || movie.title;
        movie.year = req.body.year || movie.year;
        movie.actors = req.body.actors || movie.actors;
        movie.save((err, updatedMovie) => _updateMovieAndSendResponse(err, updatedMovie, response, res));
    };
    _updateOne(req, res, movieUpdate);
};

const replaceOne = (req, res) => {
    console.log("Full Update One Game Controller");
    movieUpdate = function (req, res, movie, response) {
        movie.title = req.body.title;
        movie.year = req.body.year;
        movie.actors = [];
        movie.save((err, updatedMovie) => _updateMovieAndSendResponse(err, updatedMovie, response, res));
    };
    _updateOne(req, res, movieUpdate);
};


const deleteOne = (req, res) => {
    console.log("DELETE Movie Controller");
    const { movieId, response } = _validateMovieIdFromReqAndReturnMovieIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.deleteOne({ _id: movieId }).exec((err, deletedMovie) => _deleteMovieByIdAndReturnResponse(err, deletedMovie, response, res));
    }
};

const _validateMovieIdFromReqAndReturnMovieIdAndResponse = (req) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    const { movieId } = req.params;

    if (req.params && movieId) {
        if (!mongoose.isValidObjectId(movieId)) {
            console.log("Invalid movieId");
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid movieId";
        }
    } else {
        console.log("movieId not provided");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "movieId not provided";
    }

    return {
        movieId: movieId,
        response: response
    };
};

const _getAllMoviesAndReturnResponse = (err, movies, response, res) => {
    if (err) {
        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
    } else {
        console.log("Found Movies", movies.length);
        res.status(response.status).json(movies);
    }
};

const _findMovieByIdAndReturnResponse = (err, movie, response, res) => {
    if (err) {
        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
    } else {
        res.status(response.status).json(movie);
    }
};

const _saveNewMovieAndSendResponse = (err, savedMovie, response, res) => {
    if (err) {
        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
    } else {
        res.status(response.status).json(savedMovie);
    }

};

const _updateMovieAndSendResponse = (err, updatedMovie, response, res) => {
    if (err) {
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
        res.status(response.status).json(response.message);
    }
    res.status
        (response.status).json
        (response.message);
};

const _deleteMovieByIdAndReturnResponse = (err, deletedMovie, response, res) => {

    if (err) {
        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
    } else {
        res.status(response.status).json("Movie deleted successfully");
    }
};
module.exports = {
    getAll,
    getOne,
    addOne,
    replaceOne,
    partialUpdateOne,
    deleteOne,
};
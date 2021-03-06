var BookInstance = require("../models/bookinstance");
var Book = require("../models/book");
var async = require("async");

const { body, validationResult } = require("express-validator");

exports.book_instance_list = function (req, res, next) {
  BookInstance.find()
    .populate("book")
    .exec(function (err, list_book_instances) {
      if (err) {
        return next(err);
      }
      res.render("book_instance_list", {
        title: "Book Instance List",
        book_instance_list: list_book_instances,
      });
    });
};

exports.book_instance_detail = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function (err, book_instance) {
      if (err) {
        return next(err);
      }
      if (book_instance == null) {
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      res.render("book_instance_detail", {
        title: "Copy: " + book_instance.book.title,
        book_instance: book_instance,
      });
    });
};

exports.book_instance_create_get = function (req, res, next) {
  Book.find({}, "title").exec(function (err, books) {
    if (err) {
      return next(err);
    }
    res.render("book_instance_form", {
      title: "Create Book Instance",
      book_list: books,
    });
  });
};

exports.book_instance_create_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalse: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);

    var book_instance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      Book.find({}, "title").exec(function (err, books) {
        if (err) {
          return next(err);
        }
        res.render("book_instance_form", {
          title: "Create Book Instance",
          book_list: books,
          errors: errors.array(),
          book_instance: book_instance,
        });
      });
      return;
    } else {
      book_instance.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(book_instance.url);
      });
    }
  },
];

exports.book_instance_delete_get = function (req, res, next) {
  async.parallel(
    {
      book_instance: function (callback) {
        BookInstance.findById(req.params.id).populate("book").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book_instance == null) {
        res.redirect("/catalog/bookinstances");
      }
      res.render("book_instance_delete", {
        title: "Delete Book Instance",
        book_instance: results.book_instance,
      });
    }
  );
};

exports.book_instance_delete_post = function (req, res, next) {
  BookInstance.findByIdAndDelete(
    req.body.book_instance_id,
    function deleteBookInstance(err) {
      if (err) {
        return next(err);
      }
      res.redirect("/catalog/bookinstances");
    }
  );
};

exports.book_instance_update_get = function (req, res, next) {
  async.parallel(
    {
      book_instance: function (callback) {
        BookInstance.findById(req.params.id).populate("book").exec(callback);
      },
      books: function (callback) {
        Book.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book_instance == null) {
        var err = new Error("Book instance not found");
        err.status = 404;
        return next(err);
      }
      res.render("book_instance_form", {
        title: "Update Book Instance",
        book_instance: results.book_instance,
        book_list: results.books,
      });
    }
  );
};

exports.book_instance_update_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalse: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);

    var book_instance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      Book.find({}, "title").exec(function (err, books) {
        if (err) {
          return next(err);
        }
        res.render("book_instance_form", {
          title: "Create Book Instance",
          book_list: books,
          errors: errors.array(),
          book_instance: book_instance,
        });
      });
      return;
    } else {
      BookInstance.findByIdAndUpdate(
        req.params.id,
        book_instance,
        {},
        function (err, returned_book_instance) {
          if (err) {
            return next(err);
          }
          res.redirect(returned_book_instance.url);
        }
      );
    }
  },
];

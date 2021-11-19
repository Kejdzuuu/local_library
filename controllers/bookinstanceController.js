var BookInstance = require("../models/bookinstance");

exports.bookinstance_list = function (req, res, next) {
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

exports.bookinstance_detail = function (req, res, next) {
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

exports.bookinstance_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance create GET");
};

exports.bookinstance_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance create POST");
};

exports.bookinstance_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

exports.bookinstance_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

exports.bookinstance_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};

exports.bookinstance_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};

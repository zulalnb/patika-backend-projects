exports.getHomePage = (req, res) => {
  res.status(200).render('index');
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about');
};

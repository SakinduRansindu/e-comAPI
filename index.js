const express = require("express");
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const app = express();
const createDatabaseIfNotExists = require('./utils/createDatabaseIfNotExists');

const db = require('./models')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function extendDefaultFields(defaults, session) {
    return {
      jwt: defaults.jwt,
      expires: defaults.expires,
      userId: session.userId,
    };
  }
  
const sessionStore = new SequelizeStore({
    db: db.sequelize,
    table: "Session",
    extendDefaultFields: extendDefaultFields,
  });
  
// Sync the session store with the database
sessionStore.sync();

// Set up express-session middleware
app.use(session({
    secret: 'session_secret' || process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000}  // 1 day
}));


app.get('/helloworld', (req, res) => {
    res.send('Hello World');
});

const routes = require('./routes/index');
app.use('/api/v1', routes);

const { User, Seller, Session, SellerSocialMediaLinks, Product, ProductImgs, Purchase } = db;

User.hasMany(Purchase, { foreignKey: 'UId' });
Purchase.belongsTo(User, { foreignKey: 'UId' });

Seller.hasMany(Product, { foreignKey: 'SId' });
Product.belongsTo(Seller, { foreignKey: 'SId' });

Product.hasMany(ProductImgs, { foreignKey: 'ProductId' });
ProductImgs.belongsTo(Product, { foreignKey: 'ProductId' });

Seller.hasMany(SellerSocialMediaLinks, { foreignKey: 'SId' });
SellerSocialMediaLinks.belongsTo(Seller, { foreignKey: 'SId' });

// User has a uname, session table referes to uname as a fk not the other way around
User.hasMany(Session); // One User has many Sessions
Session.belongsTo(User);

Seller.hasMany(Session); // One seller has many Sessions
Session.belongsTo(Seller);;


createDatabaseIfNotExists().then(() => {
    db.sequelize.sync().then(() => {
        app.listen(3001, () => {
        console.log('Server running on http://localhost:3001');
        });
    });
    }).catch((error) => {
    console.error('Error creating database:', error);
    throw error;
});

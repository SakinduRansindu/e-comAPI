const express = require("express");
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
var cookieParser = require('cookie-parser')
const path = require('path');

const createDatabaseIfNotExists = require('./utils/createDatabaseIfNotExists');
const db = require('./models')
const upload = require('./utils/multerConfig');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

function extendDefaultFields(defaults, session) {
    return {
      jwt: defaults.jwt,
      expires: defaults.expires,
      userId: session.userId,
      role: session.role,
    };
  }
  
const sessionStore = new SequelizeStore({
    db: db.sequelize,
    table: "Session",
    extendDefaultFields: extendDefaultFields,
  });

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

Product.hasMany(Purchase, { foreignKey: 'ProductId' });
Purchase.belongsTo(Product, { foreignKey: 'ProductId' });


db.sequelize.sync(
        // { force: true }
    ).then(() => {
        //sync session store with db
        sessionStore.sync().then(() => {
            app.listen(3001, () => {
                console.log('Server running on http://localhost:3001');
            });
        }).catch((error) => {
            console.error('Error synchronizing session store:', error);
        });
    }).catch((error) => {
        console.error('Error syncing database:', error);
        throw error;
    });

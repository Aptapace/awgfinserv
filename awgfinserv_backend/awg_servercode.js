const mongoose = require('mongoose');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); 
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const http = require('http');
const jwt = require('jsonwebtoken');
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(cors());
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/uploads/purchaseImages', express.static(path.join(__dirname, 'uploads', 'purchaseImages')));
app.use('/uploads/profileImages', express.static(path.join(__dirname, 'uploads/profileImages')));
const mongoUri = 'mongodb://8367256082:Upendra123@localhost:27017/AwdFinserv_Storage?authSource=admin';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});
const uploadDir = path.join(__dirname, 'uploads', 'purchaseImages');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads', 'purchaseImages'));
  },
  filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}${ext}`;
      cb(null, filename);
  }
});
const upload = multer({ storage });

const planSchema = new mongoose.Schema({
  planID: { type: String, unique: true },
  name: String,
  interestRate: String,
  numberOfMonths: Number,
  minAmount: String,
  maxAmount: String,
  monthlyReturns: Array,
});
const Plan = mongoose.model('Plan', planSchema);
app.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error retrieving plans:', error);
    res.status(500).json({ error: 'Error retrieving plans' });
  }
});

const generateUniquePlanID = async () => {
  let planID;
  let isUnique = false;
  while (!isUnique) {
    planID = Math.floor(10000 + Math.random() * 90000).toString();
    const existingPlan = await Plan.findOne({ planID });
    if (!existingPlan) {
      isUnique = true;
    }
  }
  return planID;
};

app.post('/Add-plans', async (req, res) => {
  console.log('Received POST request at /plans');
  try {
    const planID = await generateUniquePlanID();
    console.log('Generated planID:', planID);
    const newPlan = { ...req.body, planID };
    const createdPlan = await Plan.create(newPlan);
    res.status(201).json(createdPlan);
  } catch (error) {
    if (error.code === 11000) {
      console.error('Duplicate planID error:', error);
      res.status(400).json({ error: 'PlanID already exists' });
    } else {
      console.error('Error adding plan:', error);
      res.status(500).json({ error: 'Error adding plan' });
    }
  }
});

const profileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userSubdirectory = req.user ? `user_${req.user.userId}` : '';
        const destination = `./uploads/profileImages/${userSubdirectory}`;
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const filename = 'profile-' + uniqueSuffix + fileExtension;
        req.profileImageFilename = filename;
        cb(null, filename);
    },
});
const profileImageUpload = multer({
    limits: { fileSize: 1024 * 1024 * 5 },
    storage: profileImageStorage,
});

const userSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    phoneNumber: { type: String, required: true, unique: true },
    password:{type: String, required: true, unique: true },
    isAppUser: { type: Boolean, index: true },
    username: String,
    profileImage: String,
    address: {
      houseNo: { type: String },
      area: { type: String },
      pincode: { type: String }
    },
    dob: { type: Date },
    registrationDate: { type: Date, default: Date.now }
});
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.userId) {
        user.userId = mongoose.Types.ObjectId().toString();
    }
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});


// const apiUrl = 'http://182.18.170.178/api.php';   
// const senderId = 'AWGFIN'; 
// const apiUsername = 'AWG'; 
// const apiPassword = '405509';
// const templateId = '1707172465706254076';
// const peid = '1701172355323729105';
// let otpStore = {};
const apiUrl = 'http://182.18.170.178/api.php';   
const senderId = 'unodig'; 
const apiUsername = 'UNODIGITECH'; 
const apiPassword = '938425';
const templateId = '1507167083272522532';
const peid = '1501353820000036572';
let otpStore = {};


app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  
  console.log('Received request to send OTP to:', phoneNumber);
  
  if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
      // Check if the phone number is already registered
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
          return res.status(400).json({ error: 'This mobile number is already registered' });
      }

      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      otpStore[phoneNumber] = otp;
      console.log(`Generated OTP: ${otp}`);

      // Send OTP via SMS (you may want to replace the following part with your SMS provider's API)
      const response = await axios.get(apiUrl, {
          params: {
              username: apiUsername,
              password: apiPassword,
              to: phoneNumber,
              from: senderId,
              // message: `Dear User, ${otp} is your Verification Code for Registration at AWGFINSERV. Thankyou www.awgfinserv.com.`,
              message:`Dear user, ${otp} is your Verification Code for registration at unodigitech. Thankyou awgfinserv`,
              PEID: peid,
              templateid: templateId
          }
      });

      console.log('Response received from SMS provider:', response.data);
      
      if (response.data.length === 16 && /^[a-f0-9]+$/.test(response.data)) { 
          console.log("OTP sent successfully. Reference ID:", response.data);
          res.json({ verificationId: phoneNumber });
      } else {
          console.error("Error from SMS provider:", response.data);
          res.status(500).json({ error: `Failed to send OTP. Response data: ${response.data}` });
      }
  } catch (error) {
      console.error('Error sending OTP:', error.message);
      if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          console.error('Error response data:', error.response.data);
      } else if (error.request) {
          console.error('Error request:', error.request);
      } else {
          console.error('Error message:', error.message);
      }
      res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
  }
});

app.post('/verify-otp', (req, res) => {
  console.log('Received body:', req.body);
  const { verificationId, otp } = req.body;

  if (!verificationId || !otp) {
      return res.status(400).json({ error: 'Verification ID and OTP are required' });
  }
  const storedOtp = otpStore[verificationId];
  if (storedOtp === otp) {
      delete otpStore[verificationId]; // OTP is valid, delete it from store
      res.json({ success: true });
  } else {
      res.status(400).json({ error: 'Invalid OTP' });
  }
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;

app.post('/register', profileImageUpload.single('profileImage'), async (req, res) => {
  console.log('Received registration request');
  const { phoneNumber, username, isAppUser, password } = req.body;

  console.log('Received data:', { phoneNumber, username, isAppUser });

  try {
    let user = await User.findOne({ phoneNumber });
    if (user) {
      const updateFields = {
        username: username || user.username,
        profileImage: req.file ? req.file.filename : user.profileImage,
      };

      user = await User.findOneAndUpdate(
        { phoneNumber },
        updateFields,
        { new: true }
      );

      console.log('User profile updated:', user);
      return res.status(200).json({
        message: 'User profile updated successfully',
        user: {
          userId: user._id,
          username: user.username,
          profileImage: user.profileImage ? user.profileImage : null,
        }
      });
    } else {
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        phoneNumber,
        isAppUser,
        username,
        password: hashedPassword,
        profileImage: req.file ? req.file.filename : undefined,
      });
      await newUser.save();
      console.log('New user registered successfully:', newUser);

      // Create a token for the new user
      const authToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET || 'yourSecretKey',
        { expiresIn: '1h' }
      );
      res.status(201).json({
        token: authToken,
        user: {
          userId: newUser._id,
          username: newUser.username,
          profileImage: newUser.profileImage ? newUser.profileImage : null,
        }
      });
    }
  } catch (error) {
    console.error('Registration or update failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  console.log('Received login request');
  console.log('Received data:', { phoneNumber, password });

  try {
    if (!phoneNumber || !password) {
      return res.status(400).json({ success: false, message: 'Phone number and password are required.' });
    }
    const user = await User.findOne({ phoneNumber });
    if (user && await bcrypt.compare(password, user.password)) {
      console.log('User logged in successfully:', user);
      const authToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'yourSecretKey',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        authToken,
        user: {
          userId: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          username: user.username,
          bio: user.bio,
          profileImage: user.profileImage,
        },
      });
    } else {
      console.error('Invalid phone number or password');
      res.status(401).json({ success: false, message: 'Invalid phone number or password' });
    }
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// Update Profile
app.patch('/update-profile', profileImageUpload.single('profileImage'), async (req, res) => {
  const { phoneNumber, username, dob, address } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const updateFields = {
      username: username || undefined,
    
      dob: dob ? new Date(dob) : undefined,
      address: address ? JSON.parse(address) : undefined, // Ensure address is parsed from JSON
      profileImage: req.file ? req.file.filename : undefined
    };

    const user = await User.findOneAndUpdate({ phoneNumber }, updateFields, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'Profile updated successfully',
      user: {
        username: user.username,
        profileImage: user.profileImage ? `${req.protocol}://${req.get('host')}/uploads/profileImages/${user.profileImageUri}` : null,
        address: user.address, // Include address in the response
        dob: user.dob
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/current-user', (req, res) => {
  const userId = req.user?._id; // Use optional chaining
  if (!userId) return res.status(401).send('Unauthorized');

  User.findById(userId)
    .then(user => {
      if (!user) return res.status(404).send('User not found');
      res.json({ userId: user._id });
    })
    .catch(err => {
      console.error('Database error:', err); // Log the full error
      res.status(500).send('Internal server error');
    });
});



app.get('/api/app-users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("Fetched User by ID:", user); // Add this line
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      phoneNumber: user.phoneNumber,
      username: user.username,
      dob: user.dob,
      address: user.address || '', 
      houseNo: user.address?.houseNo || '', 
      area: user.address?.area || '',
      pincode: user.address?.pincode || '',
      profileImage: user.profileImage ? `${req.protocol}://${req.get('host')}/uploads/profileImages/${user.profileImage}` : null,
      isPhoneNumberVerified: user.isPhoneNumberVerified
    });    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be either phoneNumber or email
  console.log('Received login request');
  console.log('Received data:', { identifier, password });

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const query = isEmail ? { email: identifier } : { phoneNumber: identifier };
    
    const user = await User.findOne(query);

    if (user && await bcrypt.compare(password, user.password)) {
      console.log('User logged in successfully:', user);

      // Create an authentication token
      const authToken = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

      // Send user details along with the token in the response
      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        authToken: authToken,
        user: {
          userId: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
        },
      });
    } else {
      console.error('Invalid phone number or email and password');
      res.status(401).json({ success: false, message: 'Invalid phone number or email and password' });
    }
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

const bankAccountSchema = new mongoose.Schema({
  bankname: String,
  accountnumber: String,
  ifsccode: String,
  holdername: String,
  branch: String,
});
const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

app.post('/bankAccount', async (req, res) => {
  const { bankname, accountnumber, ifsccode, holdername, branch } = req.body;
  console.log('Received data:', req.body); // Log the received data

  try {
    const newAccount = new BankAccount({
      bankname,
      accountnumber,
      ifsccode,
      holdername,
      branch,
    });

    await newAccount.save();
    res.status(201).json({ message: 'Bank account added successfully' });
  } catch (error) {
    console.error('Error adding bank account:', error); // Log the error
    res.status(500).json({ message: 'Error adding bank account', error });
  }
});
app.get('/bankaccounts', async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find();
    res.json(bankAccounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const purchasePlansSchema = new mongoose.Schema({
  selectedBank: String,
  amount: Number,
  transactionId: String,
  selectedImage: String,
  months: Number,
  investment: Number,
  planType: String,
  returns: Number,
  totalAmount: Number,
  planId: Number,
  status: { type: String, default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
const PurchasePlan = mongoose.model('PurchasePlan', purchasePlansSchema);

const monthlyReturnSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  username: String,
  phoneNumber: String,
  planId: { type: Number, required: true }, // Change to Number
  numberOfMonths: Number,
  returns: [{
    month: Number,
    amount: Number,
    status: { type: String, enum: ['upcoming', 'paid'], default: 'upcoming' },
    transactionId: String,
    paidAt: Date
  }]
});
const MonthlyReturn = mongoose.model('MonthlyReturn', monthlyReturnSchema);

  app.post('/api/submitPlan', upload.single('selectedImage'), async (req, res) => {
    console.log('Request received:', req.body);
    console.log('File:', req.file);
    console.log('User:', req.user);
    
    try {
        const {userId, selectedBank, amount, transactionId, months, investment, planID, planType, returns, totalAmount } = req.body;

        // Validate and convert planId
        const numericPlanId = Number(planID); // Use planID here
        if (isNaN(numericPlanId)) {
            return res.status(400).send({ error: 'Invalid planId format' });
        }

        const selectedImage = req.file ? req.file.filename : null;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: 'Invalid userId format' });
        }

        const plan = new PurchasePlan({
            userId,
            selectedBank,
            amount: Number(amount),
            transactionId,
            months: Number(months),
            investment: Number(investment),
            planType,
            returns: Number(returns),
            totalAmount: Number(totalAmount),
            selectedImage,
            planId: numericPlanId // Store the validated planId
        });
        console.log('Submitting Purchase Plan for userId:', userId);

        // Validate and save the plan
        await plan.validate(); // Validate the plan
        await plan.save(); // Save the plan
        res.status(201).send(plan); // Send the response
    } catch (error) {
        console.error('Error submitting plan:', error);
        res.status(500).send({ error: 'Failed to submit plan' });
    }
});

app.get('/api/purchaseplans', async (req, res) => {
  try {
    const plans = await PurchasePlan.find({}); // Fetch all plans, or use more specific queries
    res.send(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).send({ error: 'Failed to fetch plans' });
  }
});

app.post('/api/approvePlan', async (req, res) => {
  try {
    const { id } = req.body;

    const plan = await PurchasePlan.findByIdAndUpdate(id, { status: 'activated' }, { new: true });
    if (!plan) {
      return res.status(404).send({ error: 'Plan not found' });
    }
    const user = await User.findById(plan.userId); // Assuming you have a User model
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    console.log('Plan User ID:', plan.userId);
    console.log('Fetched User ID:', user._id);
    // Create monthly returns data
    const monthlyReturns = Array.from({ length: plan.months }, (_, index) => ({
      month: index + 1,
      amount: plan.returns / plan.months, // Assuming returns are distributed equally
      status: 'upcoming',
      planId: plan.planId // Use the planId from the PurchasePlan
    }));

    // Log the planId correctly
    console.log('planId:', plan.planId);
    const monthlyReturn = new MonthlyReturn({
      userId: plan.userId,
      username: user.username,
      phoneNumber: user.phoneNumber,
      planId: plan.planId, // This should remain a Number
      numberOfMonths: plan.months,
      returns: monthlyReturns,
    });

    await monthlyReturn.save();

    res.send({ message: 'Plan activated and monthly returns stored successfully', plan });
  } catch (error) {
    console.error('Error approving plan:', error);
    res.status(500).send({ error: 'Failed to approve plan' });
  }
});


app.get('/api/monthlyreturns', async (req, res) => {
  try {
    const returns = await MonthlyReturn.find({});
    res.send(returns);
  } catch (error) {
    console.error('Error fetching monthly returns:', error);
    res.status(500).send({ error: 'Failed to fetch monthly returns' });
  }
});

app.post('/api/payReturn', async (req, res) => {
  const { monthlyReturnId, month, transactionId } = req.body;

  try {
    const monthlyReturn = await MonthlyReturn.findById(monthlyReturnId);
    if (!monthlyReturn) {
      return res.status(404).send({ error: 'Monthly return not found' });
    }

    const returnToPay = monthlyReturn.returns.find(r => r.month === month);
    if (!returnToPay || returnToPay.status === 'paid') {
      return res.status(400).send({ error: 'Return not found or already paid' });
    }

    // Update the return to mark it as paid
    returnToPay.status = 'paid';
    returnToPay.transactionId = transactionId; // Store the transaction ID
    returnToPay.paidAt = new Date(); // Set the current date as paid date

    await monthlyReturn.save();

    res.send({ message: 'Return paid successfully', monthlyReturn });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send({ error: 'Failed to process payment' });
  }
});

app.get('/api/user-plans/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await PurchasePlan.find({ userId }).populate('userId', 'username phoneNumber'); // Populate user details if needed

    if (!plans.length) {
      return res.status(404).send({ message: 'No plans found for this user.' });
    }

    res.send(plans);
  } catch (error) {
    console.error('Error fetching user plans:', error);
    res.status(500).send({ error: 'Failed to fetch user plans' });
  }
});



 server.listen(5000, () => {
    console.log('listening on *:5000');
  });
  
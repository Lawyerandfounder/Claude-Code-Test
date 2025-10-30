// DivorceWorks Separation Guide Chatbot

// User data storage
let userData = {
    name: '',
    email: ''
};

// Chatbot state
let conversationHistory = [];

// DOM Elements
const landingPage = document.getElementById('landing-page');
const chatbotPage = document.getElementById('chatbot-page');
const userForm = document.getElementById('user-form');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const quickOptionsContainer = document.getElementById('quick-options');
const userGreeting = document.getElementById('user-greeting');
const backBtn = document.getElementById('back-btn');

// Knowledge Base for Chatbot
const knowledgeBase = {
    immediateSteps: {
        title: "Take Action Now",
        content: `**Priority actions to protect yourself:**

**Safety First**
• Contact authorities immediately if you have safety concerns
• Establish a safety plan for you and your children

**Financial Defense**
• Open a separate bank account (your name only)
• Document all assets, debts, and accounts
• Photograph valuables and important items
• Secure copies of financial records (statements, tax returns, super)

**Legal Protection**
• Never sign documents without legal review
• Archive all communications with your ex-partner
• Change passwords on critical accounts
• Update your will and beneficiary designations

**Build Your Evidence**
• Maintain a detailed timeline of key events
• Save all messages and emails
• Photograph property and belongings

**Get Expert Support**
• Connect with a family lawyer immediately
• Consider mediation or counseling
• Consult your accountant on tax implications`
    },

    assetProtection: {
        title: "Protecting Your Assets",
        content: `To protect your assets during separation:

**Documentation Steps:**
- Create a comprehensive list of all assets (property, vehicles, investments, superannuation)
- Note the approximate value and any debts associated with each asset
- Gather evidence of ownership and purchase dates
- Document contributions you've made to assets (financial and non-financial)

**Financial Actions:**
- Close joint credit cards or reduce credit limits
- Monitor joint accounts for unusual activity
- Don't dispose of or hide assets (this is illegal)
- Consider freezing joint accounts if necessary

**Professional Help:**
- Get a property valuation for real estate
- Obtain current superannuation statements
- Consult with a financial advisor about protecting your interests

**Important:** Do not transfer, sell, or dispose of assets without legal advice, as this may be considered dissipation of assets.`
    },

    parentingArrangements: {
        title: "Parenting Arrangements Guide",
        content: `When creating parenting arrangements, consider:

**Key Principles:**
- The best interests of the children are paramount
- Both parents should maintain meaningful relationships with children (where safe)
- Arrangements should be practical and sustainable

**What to Include:**
1. Living arrangements (where children will live and when)
2. Time-sharing schedule (weekdays, weekends, holidays)
3. Communication methods between parents
4. Decision-making responsibilities (education, health, religion)
5. Transition arrangements (pickup/dropoff procedures)
6. Dispute resolution process

**Creating Your Plan:**
- Put agreements in writing, even informal ones
- Be specific about times, dates, and locations
- Build in flexibility where possible
- Consider children's ages, school, activities, and relationships
- Review and update as children's needs change

**Document Templates:**
Our parenting plan template helps you structure these arrangements in a clear, legally-sound format.`
    },

    assetDivision: {
        title: "Understanding Asset Division",
        content: `Asset division in separation follows these general principles:

**The Four-Step Process:**
1. Identify the asset pool (everything owned jointly and separately)
2. Assess contributions (financial and non-financial by each party)
3. Consider future needs (earning capacity, health, care of children)
4. Determine if the division is just and equitable

**Contributions Include:**
- Financial contributions (income, inheritance, gifts)
- Non-financial contributions (homemaking, parenting, property maintenance)
- Contributions as homemaker or parent

**Future Needs Factors:**
- Age and health of each party
- Income and earning capacity
- Care arrangements for children
- Financial resources and needs

**Important Points:**
- Division is not automatically 50/50
- Superannuation is included in the asset pool
- Debts are also divided
- Timing matters - property pools are assessed at the time of settlement

Our asset summary template helps you document all assets, liabilities, and contributions for discussion with your lawyer.`
    },

    legalAdvice: {
        title: "When to Seek Legal Advice",
        content: `You should consult a family lawyer when:

- You're unsure about your legal rights and obligations
- There are significant assets or debts to divide
- You need advice on parenting arrangements
- Your ex-partner has obtained legal representation
- There are disputes about property or children
- You need to apply for court orders
- There are concerns about safety or family violence
- You're considering or have been served with legal documents

**Types of Legal Help:**
- Initial consultation (often free or fixed fee)
- Unbundled services (lawyer helps with specific tasks)
- Full representation
- Collaborative law
- Mediation with legal support`
    }
};

// Quick action options
const quickOptions = [
    { text: "Take immediate action", action: "immediateSteps" },
    { text: "Secure my assets", action: "assetProtection" },
    { text: "Plan parenting strategy", action: "parentingArrangements" },
    { text: "Understand asset division", action: "assetDivision" },
    { text: "Find legal support", action: "legalAdvice" }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeLandingPage();
});

function initializeLandingPage() {
    userForm.addEventListener('submit', handleFormSubmit);

    // Add back button functionality
    if (backBtn) {
        backBtn.addEventListener('click', handleBackButton);
    }
}

function handleBackButton() {
    // Switch back to landing page
    chatbotPage.classList.remove('active');
    landingPage.classList.add('active');

    // Clear chatbot state
    chatMessages.innerHTML = '';
    conversationHistory = [];
    userInput.value = '';
    quickOptionsContainer.innerHTML = '';
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();

    if (name && email) {
        userData.name = name;
        userData.email = email;

        // Switch to chatbot page
        landingPage.classList.remove('active');
        chatbotPage.classList.add('active');

        // Initialize chatbot
        initializeChatbot();
    }
}

function initializeChatbot() {
    // Set user greeting
    userGreeting.textContent = `Welcome, ${userData.name}`;

    // Clear chat
    chatMessages.innerHTML = '';
    conversationHistory = [];

    // Show welcome message
    const welcomeMessage = `Hi ${userData.name} — let's navigate this together.

I'll help you:
• Take immediate protective action
• Secure your financial position
• Build a smart parenting strategy
• Understand your rights and next steps

**What would you like to explore?**`;

    addBotMessage(welcomeMessage);

    // Show quick options - REMOVED FOR NOW
    // displayQuickOptions();

    // Set up input handlers
    setupChatHandlers();
}

function setupChatHandlers() {
    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
}

function handleSendMessage() {
    const message = userInput.value.trim();

    if (message) {
        addUserMessage(message);
        userInput.value = '';

        // Process the message
        setTimeout(() => {
            processUserMessage(message);
        }, 500);
    }
}

function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    conversationHistory.push({ role: 'user', content: message });

    scrollToBottom();
}

function addBotMessage(message, showOptions = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    // Convert markdown-style formatting
    const formattedMessage = formatMessage(message);
    messageContent.innerHTML = formattedMessage;

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    conversationHistory.push({ role: 'bot', content: message });

    // Quick options removed
    // if (showOptions) {
    //     displayQuickOptions();
    // }

    scrollToBottom();
}

function formatMessage(message) {
    // Use marked.js to parse markdown to HTML
    // Configure marked for safe HTML and tables
    marked.setOptions({
        breaks: true,  // Convert line breaks to <br>
        gfm: true,     // GitHub Flavored Markdown (for tables)
        tables: true,  // Enable table support
        headerIds: false,  // Don't generate header IDs
        mangle: false  // Don't mangle email addresses
    });

    // Parse markdown to HTML
    const formatted = marked.parse(message);

    return formatted;
}

function displayQuickOptions() {
    quickOptionsContainer.innerHTML = '';

    quickOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quick-option-btn';
        btn.textContent = option.text;
        btn.addEventListener('click', () => handleQuickOption(option.action));
        quickOptionsContainer.appendChild(btn);
    });
}

function handleQuickOption(action) {
    // Add user's selection as a message
    const selectedOption = quickOptions.find(opt => opt.action === action);
    addUserMessage(selectedOption.text);

    // Show typing indicator
    showTypingIndicator();

    // Respond with relevant information
    setTimeout(() => {
        hideTypingIndicator();
        respondToAction(action);
    }, 1000);
}

async function processUserMessage(message) {
    // Show typing indicator
    showTypingIndicator();

    try {
        // Call our secure Vercel serverless function proxy
        const apiUrl = `/api/chat?message=${encodeURIComponent(message)}`;

        console.log('Calling API proxy:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        hideTypingIndicator();

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();

        console.log('API response:', data);

        // Display the AI response from n8n
        // n8n returns {"text": "..."}
        const aiResponse = data.text || data.response || data.message || JSON.stringify(data);
        addBotMessage(aiResponse, true);

    } catch (error) {
        hideTypingIndicator();
        console.error('API error:', error);
        console.error('Error details:', error.message);

        // Fallback error message
        const errorMessage = `I'm having trouble connecting right now. Please try again in a moment, or select one of the options below.`;
        addBotMessage(errorMessage, true);
    }
}

function respondToAction(action) {
    if (knowledgeBase[action]) {
        const response = knowledgeBase[action].content;
        addBotMessage(response);

        // Offer documents if relevant
        if (action === 'parentingArrangements' || action === 'assetDivision') {
            setTimeout(() => {
                offerDocuments(action);
            }, 500);
        } else {
            setTimeout(() => {
                addBotMessage("**What else can I help you with?**", true);
            }, 500);
        }
    }
}

function offerDocuments(context) {
    let documentMessage = '';

    if (context === 'parentingArrangements') {
        documentMessage = `📄 **Parenting Plan Template**

A structured guide to document living arrangements, time-sharing schedules, decision-making responsibilities, and communication protocols.`;
    } else if (context === 'assetDivision') {
        documentMessage = `📄 **Asset Summary Worksheet**

Document all properties, vehicles, bank accounts, superannuation, investments, debts, and track financial and non-financial contributions by both parties.`;
    }

    addBotMessage(documentMessage);

    setTimeout(() => {
        addBotMessage("**What's next? Choose another topic or ask me anything.**", true);
    }, 500);
}

function respondWithDocuments() {
    const docResponse = `**Available resources:**

📋 **Parenting Plan Template**
Document living schedules, decision-making, and communication protocols.

📋 **Asset Summary Worksheet**
List all assets, liabilities, and contributions for property settlement discussions.

**Want details on either of these?**`;

    addBotMessage(docResponse, true);
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator-message';
    typingDiv.id = 'typing-indicator';

    const typingContent = document.createElement('div');
    typingContent.className = 'message-content typing-indicator';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingContent.appendChild(dot);
    }

    typingDiv.appendChild(typingContent);
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Store user data (in a real application, this would send to a backend)
function storeUserData() {
    // This is where you would send userData to your backend
    console.log('User data stored:', userData);
    console.log('Conversation history:', conversationHistory);
}

// Call this periodically or on certain events
setInterval(() => {
    if (conversationHistory.length > 0) {
        storeUserData();
    }
}, 30000); // Every 30 seconds

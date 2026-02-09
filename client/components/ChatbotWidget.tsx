import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const CHATBOT_RESPONSES: Record<string, string> = {
  hello: "Hello! I'm FinTrack's assistant. How can I help you today?",
  hi: "Hello! I'm FinTrack's assistant. How can I help you today?",
  help: `I'm here to help! Here are the main features of FinTrack:

📊 **Dashboard**: View your financial overview with income, expenses, and savings summary.

💳 **Transactions**: Manage your income and expense transactions with full CRUD operations.

📋 **Budget**: Set and track budgets for different categories to control your spending.

🎯 **Goals**: Create and monitor savings goals to achieve your financial objectives.

👤 **Profile**: View your profile info, financial stats, and get personalized savings tips.

What would you like to know more about?`,
  dashboard: `The **Dashboard** shows your financial overview at a glance:
• Total Income - sum of all income transactions
• Total Expenses - sum of all expense transactions  
• Total Savings - difference between income and expenses
• Savings Rate - percentage of income you're saving
• Charts - visualize spending by category and monthly trends

Visit the Dashboard to see your financial snapshot!`,
  transactions: `**Transactions** let you track your money flows:
• Add transactions (income or expense)
• Categorize each transaction
• View and search your transaction history
• Edit or delete past transactions
• Filter by date and category

Keep accurate records to better understand your spending patterns!`,
  budget: `**Budget** helps you control spending:
• Set monthly budgets for different categories
• Track spending vs. budget limits
• Get visual progress indicators
• Receive alerts when approaching limits
• Adjust budgets as needed

Create a budget to stay financially disciplined!`,
  goals: `**Goals** help you plan for the future:
• Create savings goals with target amounts
• Set target dates for achievement
• Track progress towards each goal
• View all active goals at once
• Celebrate when you reach your targets

Start a goal today - whether it's for a vacation, emergency fund, or anything else!`,
  profile: `Your **Profile** page gives you personal financial insights:
• View your profile information
• See financial stats (income, expenses, savings)
• Check your financial health summary
• Get **personalized savings tips** based on your spending
• Learn general savings strategies

Visit your profile to see personalized recommendations!`,
  "save money": `Here are some proven ways to save money:

💡 **50/30/20 Rule**: Allocate 50% to needs, 30% to wants, 20% to savings

🏦 **Automate Savings**: Set up automatic transfers to savings after each paycheck

📊 **Track Spending**: Monitor expenses to find areas to reduce

💳 **Cut Unnecessary Subscriptions**: Review and cancel unused services

🎯 **Set Goals**: Having specific goals motivates you to save

🍔 **Reduce Dining Out**: Cook at home more often

📱 **Use the Tools**: Use FinTrack to track and manage your finances better!`,
  savings: `Great question! Savings are about:

✅ **Building an Emergency Fund**: Aim for 3-6 months of expenses

✅ **Reducing Expenses**: Cut unnecessary spending

✅ **Increasing Income**: Look for ways to earn more

✅ **Automating Savings**: Make it automatic, not optional

✅ **Tracking Progress**: Monitor your savings regularly

Use your Profile page to see your current savings and get personalized tips!`,
  features: `FinTrack includes these powerful features:

✨ **Authentication**: Secure login and registration
📊 **Dashboard**: Financial overview and charts
💳 **Transactions**: Full transaction management
📋 **Budget**: Budget creation and tracking
🎯 **Goals**: Savings goal management
👤 **Profile**: Personal insights and recommendations
💾 **Local Storage**: Your data is saved locally in your browser

What would you like to explore?`,
  expense: `Tips for managing expenses:

📉 **Track Categories**: Organize expenses by type
📊 **Set Limits**: Create budgets for each category
🔍 **Review Regularly**: Check spending weekly or monthly
⚠️ **Identify Patterns**: Find where you spend the most
✂️ **Cut Unnecessary**: Reduce non-essential spending
💡 **Find Alternatives**: Look for cheaper options

Use Transactions to log every expense and Budget to control them!`,
  data: `Your data in FinTrack:

🔒 **Local Storage**: All your data is stored locally in your browser
📱 **No Server**: Your information stays private on your device
💾 **Persistent**: Data is saved even after you close the browser
⚠️ **Browser-Specific**: Data is unique to each browser
🔄 **Manual Backup**: You can export your data for backup

Start using FinTrack - your financial data is safe with you!`,
};

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! 👋 I'm FinTrack's assistant. I'm here to help you with any questions about managing your finances. Ask me anything!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Check for exact or partial matches
    for (const [key, response] of Object.entries(CHATBOT_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default response
    return `I'm not sure about that. Here are some things you can ask me about:
• Dashboard, Transactions, Budget, Goals, Profile
• How to save money, manage expenses, track spending
• About features, data storage
• General financial tips

Try asking about any of these topics!`;
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl border border-border flex flex-col w-80 h-96 mb-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span className="font-semibold">FinTrack Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="hover:bg-white/20 p-1 rounded transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-white border border-border text-foreground rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-border text-foreground px-3 py-2 rounded-lg rounded-bl-none text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-3 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me something..."
              aria-label="Chat input"
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || inputValue.trim() === ""}
              aria-label="Send message"
              className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
        className={`rounded-full p-4 shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center ${
          isOpen
            ? "bg-gray-300 text-foreground"
            : "bg-gradient-to-br from-primary to-secondary text-white"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

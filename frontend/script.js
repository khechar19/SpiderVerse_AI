// State Management
let syncedProfile = null;
let chatHistory = [];

// Sticky Navbar Logic
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Scroll Reveal Animations
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal(); // Trigger on load

// Toast Notification
function showToast(message) {
    const toast = document.getElementById("toast");
    if (message) {
        toast.innerText = message;
    }
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// 1. GENERATOR FORM SUBMISSION
const form = document.getElementById('futureme-form');
const loadingState = document.getElementById('loading-state');
const resultState = document.getElementById('result-state');
const generatorTitle = document.getElementById('generator-title');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get fields
    const name = document.getElementById('u-name').value.trim();
    const age = document.getElementById('u-age').value;
    const goal = document.getElementById('u-goal').value.trim();
    const struggle = document.getElementById('u-struggle').value.trim();
    const oneYearVision = document.getElementById('u-vision').value.trim();
    const tone = document.getElementById('u-tone').value;

    if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
        showToast("Please fill in all the quantum parameters.");
        return;
    }

    // Save profile for context
    syncedProfile = { name, age, goal, struggle, oneYearVision, tone };

    // Hide form, show loading
    form.style.display = 'none';
    loadingState.style.display = 'block';
    generatorTitle.innerText = "Synchronizing Timelines";

    // Progress text simulation
    const loadingTexts = [
        "Scanning the SpiderVerse Multiverse...",
        "Syncing temporal timelines...",
        "Decrypting future hero data...",
        "Establishing Spider communication link..."
    ];
    let textIndex = 0;
    const loadingTextElement = document.getElementById('loading-text');
    const progressInterval = setInterval(() => {
        if (textIndex < loadingTexts.length - 1) {
            textIndex++;
            loadingTextElement.innerText = loadingTexts[textIndex];
        }
    }, 800);

    try {
        const response = await fetch('/api/generate-futureme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(syncedProfile)
        });

        clearInterval(progressInterval);

        const result = await response.json();

        if (response.ok && result.success) {
            const data = result.data;

            // Populate outcomes
            document.getElementById('result-identity').innerText = data.futureIdentity || "The Unstoppable Version of You";
            document.getElementById('dynamic-message').innerText = `"${data.message}"`;
            
            // Next 3 moves list
            const movesList = document.getElementById('result-moves');
            movesList.innerHTML = '';
            if (data.nextMoves && Array.isArray(data.nextMoves)) {
                data.nextMoves.forEach((move, i) => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${i + 1}.</strong> ${move}`;
                    movesList.appendChild(li);
                });
            } else {
                movesList.innerHTML = "<li>Map out details of your initial launch.</li><li>Establish consistency filters.</li><li>Execute complex challenges first.</li>";
            }

            document.getElementById('result-habit').innerHTML = `<strong>The Daily Ritual:</strong> ${data.habit}`;
            document.getElementById('result-warning').innerText = data.warning;
            document.getElementById('result-mantra').innerText = `"${data.mantra}"`;

            // Populate Daily Blueprint
            const timelineContainer = document.getElementById('blueprint-timeline');
            timelineContainer.innerHTML = '';
            
            if (data.blueprint && Array.isArray(data.blueprint)) {
                data.blueprint.forEach((item, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'blueprint-item';
                    
                    itemDiv.innerHTML = `
                        <div class="blueprint-checkbox" id="checkbox-${index}"></div>
                        <div class="blueprint-content">
                            <div class="blueprint-time">${item.time}</div>
                            <div class="blueprint-title">${item.title}</div>
                            <div class="blueprint-desc">${item.task}</div>
                            <div class="blueprint-tip">💡 ${item.tip}</div>
                        </div>
                    `;
                    
                    // Click handler to toggle completed checklist status
                    itemDiv.addEventListener('click', () => {
                        const checkbox = itemDiv.querySelector('.blueprint-checkbox');
                        checkbox.classList.toggle('checked');
                        itemDiv.classList.toggle('completed');
                        
                        if (itemDiv.classList.contains('completed')) {
                            // Satisfying motivational notifications
                            const microQuotes = [
                                "Commitment complete! Keep swinging.",
                                "Future self approves this execution.",
                                "Outstanding progress! One step closer.",
                                "Procrastination villain neutralized!",
                                "Satisfying momentum. Maintain focus."
                            ];
                            const randomQuote = microQuotes[Math.floor(Math.random() * microQuotes.length)];
                            showToast(randomQuote);
                        }
                    });
                    
                    timelineContainer.appendChild(itemDiv);
                });
            } else {
                timelineContainer.innerHTML = '<p class="text-muted">No timeline protocol generated.</p>';
            }

            document.getElementById('blueprint-shield').innerText = data.antiVillainShield || "Stay fully focused on your first task today before checking social media notifications.";
            document.getElementById('blueprint-peptalk').innerText = data.pepTalk ? `"${data.pepTalk}"` : `"The secret of getting ahead is getting started."`;

            // Hide loading, show results
            loadingState.style.display = 'none';
            resultState.style.display = 'block';
            generatorTitle.innerText = "Timeline Connection Synced";

            // Initialize chat welcome message
            initChat(tone, name);
        } else {
            throw new Error(result.error || "Connection failure.");
        }
    } catch (error) {
        clearInterval(progressInterval);
        console.error(error);
        
        // Reset states to normal
        loadingState.style.display = 'none';
        form.style.display = 'block';
        generatorTitle.innerText = "Sync Your Timeline";
        
        showToast("FutureMe could not respond right now. Try again.");
    }
});

// 2. FORM RESET & TIMELINE REOPEN
function resetForm() {
    resultState.style.display = 'none';
    document.getElementById('chat-section').style.display = 'none';
    document.querySelector('.nav-chat-link').style.display = 'none';
    form.reset();
    form.style.display = 'block';
    generatorTitle.innerText = "Sync Your Timeline";
    syncedProfile = null;
    chatHistory = [];
    document.getElementById('chat-messages').innerHTML = '';
    
    // Clear blueprint elements
    document.getElementById('blueprint-timeline').innerHTML = '';
    document.getElementById('blueprint-shield').innerText = '';
    document.getElementById('blueprint-peptalk').innerText = '';
    
    // Scroll back smoothly to sync section
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
}

// 3. TOAST COPY UTILITY
function copyResult() {
    if (!syncedProfile) return;
    
    const identity = document.getElementById('result-identity').innerText;
    const message = document.getElementById('dynamic-message').innerText;
    const moves = Array.from(document.querySelectorAll('#result-moves li')).map(li => li.innerText).join('\n');
    const habit = document.getElementById('result-habit').innerText;
    const warning = document.getElementById('result-warning').innerText;
    const mantra = document.getElementById('result-mantra').innerText;
    
    // Blueprint text additions
    const shield = document.getElementById('blueprint-shield').innerText;
    const pepTalk = document.getElementById('blueprint-peptalk').innerText;
    const blueprintLines = Array.from(document.querySelectorAll('.blueprint-item')).map(item => {
        const time = item.querySelector('.blueprint-time').innerText;
        const title = item.querySelector('.blueprint-title').innerText;
        const desc = item.querySelector('.blueprint-desc').innerText;
        return `[ ] ${time} - ${title}: ${desc}`;
    }).join('\n');

    const summaryText = `--- FUTUREME TRANSMISSION ---\nIdentity: ${identity}\n\nMessage:\n${message}\n\nNext Moves:\n${moves}\n\nHero Habit:\n${habit}\n\nWarning:\n${warning}\n\nMantra:\n${mantra}\n\nDaily Blueprint Schedule:\n${blueprintLines}\n\nProcrastination Shield:\n${shield}\n\nPep Talk Motivation:\n${pepTalk}\n-----------------------------`;

    navigator.clipboard.writeText(summaryText).then(() => {
        showToast("Transmission copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showToast("Failed to copy. Please copy manually.");
    });
}

// 4. CHAT SYSTEM INTEGRATION
function scrollToChat() {
    const chatSec = document.getElementById('chat-section');
    chatSec.style.display = 'block';
    document.querySelector('.nav-chat-link').style.display = 'inline-block';
    
    // Trigger scroll reveal class addition proactively
    chatSec.querySelector('.reveal').classList.add('active');

    chatSec.scrollIntoView({ behavior: 'smooth' });
}

function initChat(tone, name) {
    const chatTitle = document.getElementById('chat-header-title');
    chatTitle.innerText = `Connected to ${name} (1 Year Synced)`;

    let welcomeMsg = "";
    if (tone === "Motivational" || tone === "miles") {
        welcomeMsg = `Hey ${name}, Miles here. Look, doing things your own way is a leap of faith, but it's the only way to swing past our villains and launch that goal. I'm living proof that putting in the work pays off. Let's get creative. Ask me anything.`;
    } else if (tone === "Brutally Honest" || tone === "2099") {
        welcomeMsg = `Temporal link established. Name: ${name}. Current year: 2026. Future year: 2027. We don't have time for excuses, procrastination, or anomalies. If you want to achieve our mission, we must execute flawlessly. State your question.`;
    } else if (tone === "Calm Mentor" || tone === "friendly") {
        welcomeMsg = `Hey ${name}, Friendly Neighborhood Spider here. The city isn't saved all at once, it's saved one step at a time. The friction you feel right now is just noise. Speak to me, let's find clarity on what to focus on next.`;
    } else if (tone === "CEO Mode" || tone === "leader") {
        welcomeMsg = `Alright ${name}, let's talk strategic layout. As the team lead, you need to manage your daily blueprint and optimize your habits. What is the main roadblock you are facing right now? How do we optimize?`;
    } else {
        welcomeMsg = `Hello ${name}. I'm your future Spider-Self. Let's speak honestly about where we are going and how we will get there. What is on your mind?`;
    }

    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = ''; // Clear prior

    // Add first AI bubble
    appendChatBubble("ai", welcomeMsg);
    chatHistory.push({ role: "futureme", message: welcomeMsg });
}

function appendChatBubble(role, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const bubble = document.createElement('div');
    bubble.classList.add('msg', role);
    
    if (role === 'ai') {
        bubble.innerHTML = `<div class="time-pulse" style="top: -4px; right: -4px; width: 8px; height: 8px;"></div>${text.replace(/\n/g, '<br>')}`;
    } else {
        bubble.innerText = text;
    }
    
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Chat Form submit listener
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatTyping = document.getElementById('chat-typing');

chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const question = chatInput.value.trim();
    if (!question || !syncedProfile) return;

    // Clear input & disable buttons
    chatInput.value = '';
    chatInput.disabled = true;
    chatSendBtn.disabled = true;

    // Render user bubble
    appendChatBubble("user", question);

    // Show typing dots
    chatTyping.style.display = 'block';
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch('/api/chat-futureme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userProfile: syncedProfile,
                chatHistory: chatHistory,
                question: question
            })
        });

        chatTyping.style.display = 'none';

        const result = await response.json();

        if (response.ok && result.success) {
            const reply = result.reply;
            appendChatBubble("ai", reply);

            // Save to historical state
            chatHistory.push({ role: "user", message: question });
            chatHistory.push({ role: "futureme", message: reply });
        } else {
            throw new Error(result.error || "Failed communication channel.");
        }
    } catch (error) {
        chatTyping.style.display = 'none';
        console.error(error);
        appendChatBubble("ai", "⚠️ Timeline sync interrupted. The communication tunnel experienced a temporary desynchronization. Please restate your question.");
    } finally {
        // Enable input fields
        chatInput.disabled = false;
        chatSendBtn.disabled = false;
        chatInput.focus();
    }
});

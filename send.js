const url = "https://api.groq.com/openai/v1/chat/completions";
const key = "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"; // ⚠️ Mova para o backend!

let messages = [
    {
        content: 'Olá, é um prazer conversar com você. Estou aqui para ajudar com qualquer dúvida ou informação que você precise. Como posso ajudar você hoje?',
        createdAt: '10/03/2026, 20:39:44',
        senderId: 'ai'
    }
]

function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = message.senderId === 'user'
        ? 'text-white p-3 bg-green-400 rounded-2xl rounded-tr-xs w-10/12 ml-auto m-left text-xl'
        : 'text-[#111] p-3 rounded-2xl rounded-tl-xs w-10/12 m-right text-xl'

    const pContent = document.createElement('p')
    pContent.textContent = message.content; // Previne XSS

    const pDate = document.createElement('p');
    pDate.className = message.senderId === 'user' ? 'text-[#f9f9f9] mt-4 text-xs' : 'mt-4 text-xs text-green-500';
    pDate.textContent = message.createdAt;

    div.appendChild(pContent);
    div.appendChild(pDate);
    return div;
}

function appendMessage(message) {
    const container = document.querySelector('.messages-container');
    container.appendChild(createMessageElement(message));
    container.scrollTop = container.scrollHeight; // scroll automático
}

function getSubmit() {
    const input = document.querySelector('.input-messages');
    const text = input.value.trim();
    if (!text) return;
    
    // Mensagem do usuário
    const userMsg = {
        content: text,
        senderId: 'user',
        createdAt: new Date().toLocaleString()
    };
    messages.push(userMsg);
    appendMessage(userMsg);

    input.value = ''; // limpa o campo
    sendMessage(text);
}

async function sendMessage(send) {
    let btn = document.querySelector('.button-send')
    btn.disabled = true

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Age como um motor de pesquisa que responda tudo que lhe é solicitado desde que seja algo lícito, e dá respostas completas e profissionais. NÃO USE MARCAÇÕES COMO ASTERISCO OU CRASE NEM QUALQUER OUTRO ELEMENTO PARA ESTILIZAÇÃO DO TEXTO. Se perguntarem o teu criador é o Programador Web Sílvio SG'
                    },
                    {
                        role: 'user',
                        content: send
                    }
                ]
            })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data?.choices?.length > 0) {
            const aiMsg = {
                content: data.choices[0].message.content,
                senderId: 'ai',
                createdAt: new Date().toLocaleString()
            };
            messages.push(aiMsg);
            appendMessage(aiMsg);
        } else {
            throw new Error('Resposta inválida');
        }
    } catch (err) {
        console.error(err);
        // Mensagem de erro amigável
        const errorMsg = {
            content: '❌ Erro ao conectar. Tente novamente.',
            senderId: 'ai',
            createdAt: new Date().toLocaleString()
        };
        messages.push(errorMsg);
        appendMessage(errorMsg);
    } finally {
        btn.disabled = false
    }
}


function openChat() {
    document.querySelector('.btn-open-menu').classList.add('hidden')
    document.querySelector('.chat-container').classList.remove('hidden')
}
function closeChat() {
    document.querySelector('.btn-open-menu').classList.remove('hidden')
    document.querySelector('.chat-container').classList.add('hidden')
}
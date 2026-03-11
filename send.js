const url = "https://api.groq.com/openai/v1/chat/completions";
const key = "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"; // ⚠️ mover para backend

let messages = [
{
    content: 'Olá! Sou a assistente virtual da Netship AO. É um prazer conversar com você! Estou aqui para ajudar com informações sobre nossos serviços de tecnologia: desenvolvimento de sites, sistemas, e-commerces e muito mais para impulsionar o seu negócio em Angola. Como posso ajudar você hoje?',
    createdAt: new Date().toLocaleString(),
    senderId: 'ai'
}
];

let isTyping = false;

function typeWriter(element, text, speed = 20) {
    let i = 0;

    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            element.parentElement.parentElement.scrollTop =
                element.parentElement.parentElement.scrollHeight;
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}

function createMessageElement(message) {

    const div = document.createElement('div');

    div.className =
        message.senderId === 'user'
            ? 'text-white p-3 whitespace-pre-line bg-green-400 rounded-2xl rounded-tr-xs w-10/12 ml-auto m-left text-xl'
            : 'text-[#111] p-3 whitespace-pre-line rounded-2xl rounded-tl-xs w-10/12 m-right text-xl';

    const pContent = document.createElement('p');

    if (message.senderId === 'ai' && message.isTyping) {

        pContent.className = 'typing-animation';
        pContent.innerHTML = '<span></span><span></span><span></span>';

    } else if (message.senderId === 'ai' && message.typeWriter) {

        setTimeout(() => {
            typeWriter(pContent, message.content);
        }, 100);

    } else {

        pContent.textContent = message.content;

    }

    const pDate = document.createElement('p');

    pDate.className =
        message.senderId === 'user'
            ? 'text-[#f9f9f9] mt-4 text-xs'
            : 'mt-4 text-xs text-green-500';

    pDate.textContent = message.createdAt || '';

    div.appendChild(pContent);
    div.appendChild(pDate);

    return div;
}

function appendMessage(message) {

    const container = document.querySelector('.messages-container');

    container.appendChild(createMessageElement(message));

    container.scrollTop = container.scrollHeight;

}

function showTypingIndicator() {

    if (isTyping) return;

    isTyping = true;

    const typingMsg = {
        senderId: 'ai',
        isTyping: true,
        createdAt: ''
    };

    const container = document.querySelector('.messages-container');

    const typingElement = createMessageElement(typingMsg);

    typingElement.id = 'typing-indicator';

    container.appendChild(typingElement);

    container.scrollTop = container.scrollHeight;

}

function removeTypingIndicator() {

    const typingElement = document.getElementById('typing-indicator');

    if (typingElement) {
        typingElement.remove();
    }

    isTyping = false;

}

function getSubmit() {

    const input = document.querySelector('.input-messages');

    const text = input.value.trim();

    if (!text) return;

    const userMsg = {
        content: text,
        senderId: 'user',
        createdAt: new Date().toLocaleString()
    };

    messages.push(userMsg);

    appendMessage(userMsg);

    input.value = '';

    sendMessage(text);

}

async function sendMessage(send) {

    let btn = document.querySelector('.button-send');

    btn.disabled = true;

    showTypingIndicator();

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
                        content: `Você é a assistente virtual oficial da Netship AO, uma startup angolana de tecnologia fundada por jovens programadores e designers. 
                        
                        SOBRE A NETSHIP AO:
                        - Somos uma startup angolana focada em impulsionar Angola através da tecnologia e inovação
                        - Nossa equipe é formada por jovens programadores e designers angolanos talentosos
                        - Oferecemos serviços de criação de landing pages, sites institucionais, sistemas de agendamento, e-commerces e outras soluções digitais
                        - Nosso objetivo é contribuir para o desenvolvimento tecnológico de Angola
                        
                        REGRAS IMPORTANTES:
                        1. SEMPRE responda como representante da Netship AO
                        2. Se perguntarem sobre assuntos NÃO relacionados à Netship AO (como outros assistentes, outras empresas, ou temas fora do nosso escopo), diga educadamente: "Sou a assistente virtual da Netship AO e estou aqui apenas para falar sobre nossos serviços e soluções tecnológicas. Posso ajudar com informações sobre desenvolvimento de sites, sistemas, e-commerces ou outros serviços digitais para o seu negócio em Angola."
                        3. Use linguagem profissional mas acolhedora
                        4. Destaque que somos uma equipa jovem e angolana
                        5. Incentive o contacto para orçamentos e projetos personalizados
                        6. NÃO use marcações como asteriscos ou crases para estilização
                        7. Responda sempre em português de Angola
                        
                        Exemplos de respostas adequadas:
                        - Para perguntas quem es tu: "Sou a assistente digital da Netship, posso responder as suas perguntas ou eventuais duvidas sobre nos, o que o Sr(a). quer saber?
                        - Para perguntas sobre serviços: "Na Netship AO, temos uma equipa especializada em criar soluções digitais personalizadas. Podemos desenvolver landing pages, sites institucionais, sistemas de agendamento e e-commerces. Qual é o seu projeto?"
                        - Para perguntas sobre a equipa: "A Netship AO é formada por jovens programadores e designers angolanos apaixonados por tecnologia. Trabalhamos juntos para criar soluções inovadoras e impulsionar o desenvolvimento digital do nosso país."
                        - Para perguntas fora do tema: "Sou a assistente da Netship AO e meu papel é ajudar com informações sobre nossos serviços tecnológicos. Se tiver interesse em saber mais sobre como podemos ajudar o seu negócio, ficarei feliz em responder!"
                        
                        So envia mensagem longas quando for necessario, ta. 
                        Se nas instrucoes anteriores eu escreve errado, ou sem acentos, fique a vontade para corrigir e/ou melhorar...
                        `
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

        setTimeout(() => {

            removeTypingIndicator();

            if (data?.choices?.length > 0) {

                const aiMsg = {
                    content: data.choices[0].message.content,
                    senderId: 'ai',
                    createdAt: new Date().toLocaleString(),
                    typeWriter: true
                };

                messages.push(aiMsg);

                appendMessage(aiMsg);

            } else {

                throw new Error('Resposta inválida');

            }

        }, 1200);

    } catch (err) {

        console.error(err);

        removeTypingIndicator();

        const errorMsg = {
            content: '❌ Desculpe, tivemos um problema de conexão. Por favor, tente novamente.',
            senderId: 'ai',
            createdAt: new Date().toLocaleString()
        };

        messages.push(errorMsg);

        appendMessage(errorMsg);

    } finally {

        btn.disabled = false;

    }

}

function openChat() {

    document.querySelector('.btn-open-menu').classList.add('hidden');

    document.querySelector('.chat-container').classList.remove('hidden');

}

function closeChat() {

    document.querySelector('.btn-open-menu').classList.remove('hidden');

    document.querySelector('.chat-container').classList.add('hidden');

}

window.addEventListener('load', () => {

    setTimeout(() => {

        appendMessage(messages[0]);

    }, 500);

});
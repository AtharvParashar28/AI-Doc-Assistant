import axios from "axios"
import prisma from "../config/prisma"
import { MessageRole } from "../generated/prisma/enums"

type promptPayload = {
    model: String
    messages: {
        role: string,
        content: string
    }[],
    options: {
        temperature: number,
        num_predict: number
    },
    stream: boolean
}

type chatPayload = {
    documentId: string,
    title: string,
}

type messagePayload = {
    chatId: string,
    role: MessageRole,
    content: string
}


export async function generateResponse(prompt: string, chatId : string, userId : string) {
    const model = process.env.MODEL!;
    const endpoint = process.env.OLLAMA_ENDPOINT!;
    const temp = Number(process.env.TEMPERATURE!);
    const num = Number(process.env.NUM_PREDICT!);
    const stream = process.env.STREAM! === 'true' ? true : false;

    // store new message and get chat history
    // build required body for ollama

    const userMessage : messagePayload = {
        chatId : chatId,
        role : MessageRole.USER,
        content : prompt
    }


    await storeMessages(userMessage);

    const context = await getChatHistory(chatId, userId);

console.log(context);



    const payload: promptPayload = {
        model: model,
        messages: context,
        options: {
            temperature: temp,
            num_predict: num,
        },
        stream: stream
    }

    console.log(payload);

    try {
        // make api call to ollama
        const ollamaResponse = await axios.post(endpoint, payload);
        console.log(ollamaResponse.data);

        // Store newly generated message
        const assistantMessage : messagePayload = {
            chatId : chatId,
            role : MessageRole.ASSISTANT,
            content : ollamaResponse.data.message.content
        }

        await storeMessages(assistantMessage);

        return ollamaResponse.data.message.content;
    } catch (error) {
        console.log(error);
    }

}

export async function getChatHistory(chatId: string, userId : string) {
    const messages = await prisma.message.findMany({
        where: {
            chatId: chatId,
            chat : {
                document : {
                    uploadedBy : userId
                }
            }
        },
        select : {
            role : true,
            content : true
        },
        orderBy : {
            createdAt : "desc"
        },
        take : 20

    })

    console.log("chat history -> ", messages);

     return messages.reverse().map((message) => ({
        role: message.role.toLowerCase(),
        content: message.content
    }));

}

export async function createChat(newChat: chatPayload, documentId : string) {
    // Db call to store chat 
    // It should only run once per chat

    try {
        const chat = await prisma.chat.create({
            data: newChat
        })

        console.log(chat);

        return chat;
    } catch (error) {
        throw error;
    }

}

export async function storeMessages(newMessage: messagePayload) {
    try {
        const message = await prisma.message.create({
            data: newMessage
        })

        console.log(message);

        return message;
    } catch (error) {
        throw error;
    }
}
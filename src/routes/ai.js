const express = require('express');
const router = express.Router();
const openaiClient = require('../openaiClient');
const imagenClient = require('../imagenClient');

router.post('/generate-images', async (req, res) => {

    const { menuPhoto } = req.body;
    
    const geminiResponse = await openaiClient.chat.completions.create({
        model: "google/gemini-2.5-pro-preview-03-25",
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Analyze the menu photo and extract the names and ingredients of the menu items. Provide a list of items with their respective ingredients.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": menuPhoto
                        },
                    },
                ]
            }
        ], 
        tools: [
            {
                type: 'function',
                function: {
                    name: 'getMenuItemsData',
                    description: 'The function extracts information about menu items from an image including their names and ingredients.',
                    parameters: {
                        type: 'object',
                        properties: {
                            menuItems: {
                                type: 'array',
                                description: 'List of menu items.',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'Name of the menu item',
                                        },
                                        ingredients: {
                                            type: 'array',
                                            description: 'Ingredients of the menu item',
                                            items: { type: 'string' } 
                                        }
                                    },
                                    required: ['name', 'ingredients']
                                }
                            }
                        },
                        required: ['menuItems']
                    }
                }
            }
        ],
        tool_choice: {
            type: 'function',
            function: {
                name: 'getMenuItemsData'
            }
        }
    });

    const toolCall = geminiResponse.choices[0].message.tool_calls[0];
    const rawArguments = toolCall.function.arguments;
    const toolOutput = JSON.parse(rawArguments);

    const requestsToGenerateImages = toolOutput.menuItems.map((item) => {

        return imagenClient.images.generate({
            model: 'imagen-3.0-generate-002',
            prompt: `Create an image of a dish called ${item.name}. This dish has the following ingredients: ${item.ingredients.join(', ')}`,
            n: 1,
            response_format: "b64_json",
        });

    });

    const imageResponses = await Promise.all(requestsToGenerateImages);
    const menuWithImages = imageResponses.map((response, index) => {

        const dish = {
            name: toolOutput.menuItems[index].name,
            ingredients: toolOutput.menuItems[index].ingredients,
            image: 'data:image/png;base64,' + response.data[0].b64_json
        };

        return dish;

    });

    res.status(200).json({ menuWithImages: menuWithImages });

});

module.exports = router;
function slackRichTextToMrkdwn(richTextBlocks) {
    if (!Array.isArray(richTextBlocks) || richTextBlocks.length === 0) {
        return '';
    }

    let fullMrkdwn = '';

    /**
     * Recursively processes a single rich-text element and converts it to mrkdwn.
     * @param {Object} element The rich-text element to process.
     * @param {number} listLevel The current nesting level for lists (used for indentation).
     * @returns {string} The mrkdwn representation of the element.
     */
    function processElement(element, listLevel = 0) {
        let mrkdwn = '';

        if (!element) {
            return '';
        }

        switch (element.type) {
            case 'text':
                // Basic text content with optional styling
                mrkdwn += element.text || '';
                if (element.style) {
                    if (element.style.bold) {
                        mrkdwn = `*${mrkdwn}*`;
                    }
                    if (element.style.italic) {
                        mrkdwn = `_${mrkdwn}_`;
                    }
                    if (element.style.strike) {
                        mrkdwn = `~${mrkdwn}~`;
                    }
                    if (element.style.code) { // Inline code
                        mrkdwn = `\`${mrkdwn}\``;
                    }
                }
                break;

            case 'link':
                // Hyperlinks: <URL|text> or just <URL> if text is not provided or is same as URL
                const url = element.url || '';
                const linkText = element.text || '';
                if (linkText && linkText !== url) {
                    mrkdwn += `<${url}|${linkText}>`;
                } else {
                    mrkdwn += `<${url}>`;
                }
                break;

            case 'user':
                // User mentions: <@USER_ID>
                mrkdwn += `<@${element.user_id}>`;
                break;

            case 'channel':
                // Channel mentions: <#CHANNEL_ID|channel-name> or just <#CHANNEL_ID>
                // Slack's rich text often only provides channel_id.
                const channelId = element.channel_id || '';
                const channelName = element.channel_name || ''; // channel_name might not always be present
                if (channelName && channelName !== channelId) {
                    mrkdwn += `<#${channelId}|${channelName}>`;
                } else {
                    mrkdwn += `<#${channelId}>`;
                }
                break;

            case 'emoji':
                // Emoji: :emoji_name:
                mrkdwn += `:${element.name}:`;
                break;

            case 'rich_text_section':
                // A container for other elements, usually forming a single line or paragraph.
                if (Array.isArray(element.elements)) {
                    mrkdwn += element.elements.map(e => processElement(e, listLevel)).join('');
                }
                break;

            case 'rich_text_list':
                // Bullet or ordered lists
                const indentSpaces = ' '.repeat(listLevel * 4); // 4 spaces per level for indentation
                if (Array.isArray(element.elements)) {
                    element.elements.forEach((item, index) => {
                        // Determine the list prefix: "1. " for ordered, "* " for bullet
                        const prefix = element.style === 'ordered' ? `${index + 1}. ` : '* ';
                        // Process the content of the list item, increasing the list level
                        const itemContent = processElement(item, listLevel + 1);

                        // Split item content by newlines to apply correct indentation to each line
                        const lines = itemContent.split('\n').filter(line => line.length > 0);

                        if (lines.length > 0) {
                            // First line gets the prefix
                            mrkdwn += `${indentSpaces}${prefix}${lines[0]}\n`;
                            // Subsequent lines are indented to align with the first line's text
                            for (let i = 1; i < lines.length; i++) {
                                mrkdwn += `${indentSpaces}${' '.repeat(prefix.length)}${lines[i]}\n`;
                            }
                        } else {
                            // Handle empty list items, still adding the prefix and a newline
                            mrkdwn += `${indentSpaces}${prefix}\n`;
                        }
                    });
                }
                // Remove trailing newline if this list is the last content of its parent,
                // or if it was an empty list.
                if (mrkdwn.endsWith('\n') && listLevel === 0) { // Only remove if top-level list
                     mrkdwn = mrkdwn.slice(0, -1);
                } else if (mrkdwn.endsWith('\n\n')) { // Avoid double newlines between elements
                    mrkdwn = mrkdwn.slice(0, -1);
                }
                break;

            case 'rich_text_quote':
                // Blockquotes: each line prefixed with "> "
                if (Array.isArray(element.elements)) {
                    const quoteContent = element.elements.map(e => processElement(e, listLevel)).join('');
                    // Split content by lines and prefix each with "> "
                    mrkdwn += quoteContent.split('\n').map(line => `> ${line}`).join('\n');
                }
                break;

            case 'rich_text_preformatted':
                // Code blocks: wrapped in ```
                if (Array.isArray(element.elements)) {
                    // Preformatted blocks typically contain only text elements.
                    // We join their raw text content to preserve formatting inside the block.
                    const preformattedContent = element.elements.map(e => e.text || '').join('');
                    mrkdwn += `\`\`\`\n${preformattedContent}\n\`\`\``;
                }
                break;

            default:
                // Fallback for unhandled types: attempt to process any nested elements
                if (Array.isArray(element.elements)) {
                    mrkdwn += element.elements.map(e => processElement(e, listLevel)).join('');
                }
                break;
        }

        return mrkdwn;
    }

    // Iterate through each top-level rich_text block
    richTextBlocks.forEach(block => {
        if (block.type === 'rich_text' && Array.isArray(block.elements)) {
            block.elements.forEach(element => {
                fullMrkdwn += processElement(element);
            });
        }
    });

    //This will return just the mrkdwn text, but we want it in a section block
    // return fullMrkdwn;



    const newSectionBlock = [
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": fullMrkdwn
			}
		}
    ];

    const result = {
        sectionBlock: newSectionBlock,
        mrkdwnText: fullMrkdwn
    }

    return (result)
    // return (newSectionBlock)

}

module.exports = slackRichTextToMrkdwn
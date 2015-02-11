module.exports = {
    prefix: {
        internal: { text: '+', tag: 'cyan-fg', wrapped: '{cyan-fg}+{/cyan-fg}' },
        incoming: { text: '>', tag: 'green-fg', wrapped: '{green-fg}+{/green-fg}' },
        outgoing: { text: '<', tag: 'red-fg', wrapped: '{red-fg}+{/red-fg}' },
    },

    // This is for help info only
    hotkeys: {
        'Ctrl+Up': 'Scrolls the console up a page.',
        'Ctrl+Down': 'Scrolls the console down a page.',
        'Ctrl+C': 'Clears the line in sio or, if already clear, exits'
    }
};

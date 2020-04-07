const winHeight = {
    computed: {
        winHeight() {
            return this.$store.state.Jurisdiction.winHeight;
        },
        tableMaxHeight() {
            return this.$store.state.Jurisdiction.winHeight - 210 + 'px';
        }
    }
};
export default winHeight;

class Web {
    static async selectItem() {
        const response = await fetch('/item_detail', {
            method: 'POST',
            body: {'key' : 'value'},
        })

        console.log(response)
        return response;
    }
}

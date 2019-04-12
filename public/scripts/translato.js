/*******************************************************************************
**************************** Client side management  ***************************
*******************************************************************************/

let translato = new Vue({
	el: '#translato',
	data: () => ({
		life_count: 10,
		user_result: "",
		word: "",
		t_word: "",
		t_word_length: 0,
		level: 10
	}),
	methods: {
		// Resets the game
		reset_game: function() {
			this._data.life_count = 10;
			this.fetch_word();
		},

		// Gets a new word from the translation api using the current level of the player.
		fetch_word: function() {
			axios.get(`/${this._data.level}`)
			.then((response) => {
				if (response.data) {
					this._data.word = response.data.word;
					this._data.t_word = response.data.t_word;
					this._data.user_result = response.data.t_word[0].toUpperCase();
					this._data.t_word_length = response.data.t_word.length;
				}
			}).catch((err) => {
				if (err) console.log(err);
				swal("Oops!", `An error occured on our side, sorry for the inconvenience.`, "error");
			})
		},

		// Checks the user input and shows the correct modal.
		test_user_result: function() {
			if (this._data.user_result.toLowerCase() == this._data.t_word) {
				this._data.life_count++;
				this._data.level += this._data.life_count % 2;
				if (this._data.life_count == 20)
					swal("Bravo!", "Vous avez atteint le dernier niveau!", "success").then(() => { this.reset_game(); })
				else swal("Excellent!", "Vous avez trouvé la traduction correcte!", "success").then(() => { this.fetch_word(); })
			} else {
				this._data.life_count--;
				this._data.level -= this._data.life_count % 2;
				if (!this._data.life_count)
					swal("GAME OVER", "Vous ferez mieux la porchaine fois!", "error").then(() => { this.reset_game(); });
				else swal("Oops!", `Mauvaise réponse, la traduction était: ${this._data.t_word}`, "error").then(() => { this.fetch_word(); })
			}
			this._data.user_result = "";
		}
	},

	// Fetches the first word.
	beforeMount: function () { this.fetch_word(); }
})



const FRXNK_APP = {
    state: [],

    async init() {
        try {
            const response = await fetch('posters.json');
            this.state = await response.json();

            setTimeout(() => {
                document.body.classList.remove('loading');
                this.render();
                this.startGlobalSync();
            }, 2000);
        } catch (err) {
            console.error("SYS_ERROR: Archive connection failed.", err);
        }
    },

    startGlobalSync() {
        setInterval(() => {
            this.state.forEach(movie => {
                movie.posterindex = (movie.posterindex + 1) % movie.posters.length;
            });
            this.render();
        }, 5000);
    },

    updateLikes(title) {
        const movie = this.state.find(m => m.title === title);
        if (movie) {
            movie.likes++;
            this.render();
        }
    },

    openDossier(title) {
        const movie = this.state.find(m => m.title === title);
        const overlay = document.createElement('div');
        overlay.className = 'intel-overlay';
        overlay.innerHTML = `
            <div class="intel-modal" style="--accent: ${movie.theme}">
                <div class="modal-header">
                    <h3>DOSSIER: ${movie.title}</h3>
                    <button onclick="this.closest('.intel-overlay').remove()">[CLOSE]</button>
                </div>
                <div class="modal-body">
                    <p><span>IMDB_RANK:</span> ${movie.iscore}</p>
                    <p><span>MPAA_RATING:</span> ${movie.rating}</p>
                    <p><span>RELEASE_DATE:</span> ${movie.released.join('.')}</p>
                    <p><span>ORIGIN:</span> ${movie.country}</p>
                    <div class="intel-box">${movie.details}</div>
                    <div class="links">
                        <a href="${movie.imdb}" target="_blank">IMDB_DATA</a>
                        <a href="${movie.website}" target="_blank">WEB_SOURCE</a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    render() {
        const container = document.getElementById('gallery');
        container.innerHTML = this.state.map(movie => `
            <article class="hud-card" style="--accent: ${movie.theme}">
                <div class="poster-viewport">
                    <img src="${movie.posters[movie.posterindex]}" class="poster-img sync-fade" alt="${movie.title}">
                    <div class="hud-iscore">${movie.iscore}</div>
                    <div class="hud-country">${movie.country}</div>
                </div>
                <div class="hud-info">
                    <h2 class="title-tech">${movie.title}</h2>
                    <div class="hud-controls">
                        <button class="btn-sync" onclick="FRXNK_APP.updateLikes('${movie.title}')">SYNC_LIKE [${movie.likes}]</button>
                        <button class="btn-intel" onclick="FRXNK_APP.openDossier('${movie.title}')">INTEL</button>
                    </div>
                </div>
            </article>
        `).join('');
    }
};


FRXNK_APP.init();
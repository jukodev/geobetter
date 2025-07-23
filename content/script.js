(function () {
	const seen = new WeakSet();

	const INDICATOR_STYLE = `
    margin-left:4px;
    padding: 0 .5rem!important;
    display: inline-flex;
    align-items: center;
    flex-direction: row-reverse;
    gap: 0.5rem;

    background-color: var(--ds-color-white-10);
    border-radius: .5rem;
    box-shadow: 0 .25rem 2.75rem rgba(32,17,46,.2),0 1.125rem 2.25rem -1.125rem rgba(0,0,0,.24),0 1.875rem 3.75rem -.625rem rgba(0,0,0,.16);
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  `;

	const CHAMPION = `<img alt="Champion" class="multiplayer_icon__hRbEa" style="color: transparent; width: auto; height: 2rem;" src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fchampion-new.84e780e9.webp&amp;w=1200&amp;q=75">`;
	const MASTER_1 = `<img alt="Master I" class="multiplayer_icon__hRbEa" style="color: transparent; width: auto; height: 2rem;" src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmaster1-new.2222a9ef.webp&amp;w=1200&amp;q=75">`;
	const MASTER_2 = `<img alt="Master II" class="multiplayer_icon__hRbEa" style="color: transparent; width: auto; height: 2rem;" src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmaster2-new.1b2adebb.webp&amp;w=1200&amp;q=75">`;
	const GOLD_1 = `<img alt="Gold I" class="multiplayer_icon__hRbEa" style="color: transparent; width: auto; height: 2rem;" src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgold1-team-new.cbba647c.webp&w=1200&amp;q=75">`;
	const GOLD_2 = `<img alt="Gold II" class="multiplayer_icon__hRbEa" style="color: transparent; width: auto; height: 2rem;" src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgold2-team-new.35285f02.webp&w=1200&amp;q=75">`;
	const GOLD_3 = `<img alt="Gold III" class="multiplayer_icon__hRbEa" style="color: transparent; width: auto; height: 2rem;" src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgold3-new.0480d44d.webp&amp;w=1200&amp;q=75">`;

	const rankIcons = new Map([
		["Champion", CHAMPION],
		["Master I", MASTER_1],
		["Master II", MASTER_2],
		["Gold I", GOLD_1],
		["Gold II", GOLD_2],
		["Gold III", GOLD_3],
	]);

	function collectUserPaths() {
		const html = document.documentElement.innerHTML;
		const regex = /\/user\/([^"'<>\/\s]+)/g;
		const set = new Set();
		let m;
		while ((m = regex.exec(html)) !== null) {
			set.add(m[0]);
		}
		return Array.from(set);
	}

	function injectElo() {
		document.querySelectorAll(".user-nick_nick__sRjZ2").forEach(el => {
			if (seen.has(el)) return;
			seen.add(el);
			const users = collectUserPaths();

			const text = el.textContent.trim();
			fetch(
				`https://vid.burger.supply/users/${encodeURIComponent(text)}`,
				{
					method: "PUT",
					body: JSON.stringify({ ids: users }),
					headers: { "Content-Type": "application/json" },
				}
			)
				.then(response => response.json())
				.then(data => {
					if (!data || !data["nick"]) {
						console.warn("No data found for nick:", text);
						return;
					}

					const dot = document.createElement("div");
					dot.style.cssText = INDICATOR_STYLE;
					dot.textContent = data["rating"]
						? data["rating"]
						: data[""];
					const img = document.createElement("div");
					img.innerHTML = rankIcons.get(data["divisionName"]) || "";
					dot.appendChild(img);
					el.after(dot);
				})
				.catch(error => {
					console.log("API error:", error);
				});
		});
		document
			.querySelectorAll(".team-matchmaking-layout_playerName__BnRRv")
			.forEach(el => {
				if (seen.has(el)) return;
				seen.add(el);
				const users = collectUserPaths();

				const text = el.textContent.trim();
				fetch(
					`https://vid.burger.supply/users/${encodeURIComponent(
						text
					)}`,
					{
						method: "PUT",
						body: JSON.stringify({ ids: users }),
						headers: { "Content-Type": "application/json" },
					}
				)
					.then(response => response.json())
					.then(data => {
						if (!data || !data["nick"]) {
							console.warn("No data found for nick:", text);
							return;
						}

						const eloDiv = document.createElement("div");
						eloDiv.style.cssText = INDICATOR_STYLE;
						eloDiv.textContent = data["rating"]
							? data["rating"]
							: data[""];
						const rankImg = document.createElement("div");
						rankImg.innerHTML =
							rankIcons.get(data["divisionName"]) || "";
						eloDiv.appendChild(rankImg);
						el.appendChild(eloDiv);
					})
					.catch(error => {
						console.log("API error:", error);
					});
			});
	}

	injectElo();

	const obs = new MutationObserver(injectElo);
	obs.observe(document.body, { childList: true, subtree: true });
})();

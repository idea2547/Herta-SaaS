<script>
	import '../app.css';
	export let data;
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
			>
				<li><a>Item 1</a></li>
				<li>
					<a>Parent</a>
					<ul class="p-2">
						<li><a>Submenu 1</a></li>
						<li><a>Submenu 2</a></li>
					</ul>
				</li>
				<li><a href="/pricing">Pricing</a></li>
			</ul>
		</div>
		<a href="/" class="btn btn-ghost text-xl">Herta SaaS</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a>Features</a></li>
			<li>
				<details>
					<summary>Template</summary>
					<ul class="p-2">
						<li><a>Submenu 1</a></li>
						<li><a>Submenu 2</a></li>
					</ul>
				</details>
			</li>
			<li><a href="/pricing">Pricing</a></li>
		</ul>
	</div>
	<div class="navbar-end">
		{#if data.user}
		<form action="/logout" method="POST">
			<button class="btn" type="submit">Logout</button>
		</form>
		{:else}
			<a href="/login" class="btn">Login</a>
		{/if}
		
	</div>
</div>

<slot />

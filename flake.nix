{
  description = "Astro-Projekt mit Nix-Flakes";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs       # Node.js für Astro
            pkgs.yarn         # Optional: yarn als Paketmanager
          ];
          shellHook = ''
            echo "Entwicklungsumgebung für Astro ist aktiv."
            # Falls du Astro global installieren möchtest:
            # npm install -g astro
          '';
        };

        # Optional: Eine App-Definition, falls du über nix build auch ein Release erstellen möchtest
        packages.default = pkgs.stdenv.mkDerivation {
          name = "astro-app";
          src = null;
          buildInputs = [ pkgs.nodejs ];
          buildPhase = "echo 'Building Astro App...'";
        };
      });
}

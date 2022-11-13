export interface ITranslations {
  [key: string]: (string | object) & {
    localName: string;
    message: Record<string, unknown>;
    commands: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export default <ITranslations>{
  'en-GB': {
    localName: 'English - GB',
    message: {
      dbError: 'Error when saving into the database',
      alreadySave: 'This channel is already saved',
      commandError: 'There was an error while executing this command',
      rateLimited: 'Please wait: %s until next use of that command',
    },
    commands: {
      ping: 'Pong! - EN',
      local: { reply: 'Updated guild preferred language to %s' },
      read: {
        done: 'Done!',
        invalidId: 'Invalid message id',
        notTextBased: 'This channel is not text based',
      },
    },
  },
  fr: {
    localName: 'Français',
    message: {
      dbError:
        // TODO: Ajouter le lien vers github
        "Erreur lors de la connexion à base de donnée (Si l'incident persiste merci d'ajouter un issue sur Github)",
      alreadySave: 'Ce salon est déjà enregistré',
      commandError: "Une erreur est survenu lors de l'execution de la commande",
      rateLimited:
        "Délai d'attente: %s avant la prochaine utilisation de la commande",
    },
    commands: {
      channel: {
        get: {
          embed: {
            title: 'Salon%s en écoute sur ce serveur %s',
            limited: '(Réponse limité à 25 salons)',
            description: 'ajouté le, par',
          },

          reply:
            "Aucun salon est en écoute sur ce serveur, pour en ajouter utilisez la commande `/channel add` suivis d'un salon",
        },
        add: {
          reply: 'Salon %s ajouté!',
        },
        delete: {
          reply: 'Salon %s supprimé!',
        },
      },
      enable: {
        deleted: 'Ce salon ne mettra plus à jour votre Playlist!',
        saved: 'Salon ajouté!',
        savedNoPlaylist:
          "Salon ajouté! Mais vous n'avez pas configuré de playlist sur le site: %s/playlist",
        notFound:
          'Utilisateur introuvable. Merci de vous enregistrer au préalable en tapant la command `/register`',
      },
      locale: {
        replySet: 'Mise à jour de la langue préférée du serveur vers %s',
        replyGet: 'Localisation préférée: %s',
      },
      read: {
        done: 'Fait!',
        ok: 'Ok',
        invalidId: 'Mauvais id de message',
        notTextBased: "Le salon n'est pas un salon textuel",
      },
      register: {
        checkDM: 'Regarde tes DM',
        embed: {
          title:
            'Cliquez sur ce lien pour lier votre compte Spotify à %s (Lien valide 1 heure)',
        },
      },
      stats: {
        title: 'Statistique du bot',
        ping: 'Ping',
        uptime: 'Durée de fonctionnement',
        memory: 'Mémoire',
        servers: 'Serveurs',
        playlistsUpdated: 'Playlists mise à jour',
        channelScanned: 'Salon analysé',
        version: 'Version',
      },
      ping: 'Pong! - FR',
    },
  },
};

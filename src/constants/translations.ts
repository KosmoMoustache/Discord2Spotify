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
      dbError:
        'Error when connecting to the database. If the problem persists please file an issue on Github (https://s.kosmo.ovh/dotify)',
      alreadySave: 'This channel is already saved',
      commandError: 'There was an error while executing this command',
      rateLimited: 'Please wait: %s until next use of that command',
    },
    commands: {
      channel: {
        get: {
          embed: {
            title: 'Channel%s scanned on the server %s',
            limited: '(Response limited to 25 channels)',
            description: 'added the, by',
            fields: '%s by %s',
          },
          reply:
            'No channel is listening on this server, to add one use the command `/channel add` followed by a channel name',
        },
        add: {
          reply: 'Channel %s added!',
        },
        delete: {
          reply: 'Channel %s deleted!',
        },
      },
      enable: {
        deleted: 'This channel will no longer update your Playlist!',
        saved: 'Channel added!',
        savedNoPlaylist:
          "Channel added! But you haven't configured a playlist on the site: %s/playlist",
        notFound:
          'User not found. Please register first by typing the command `/register`.',
      },
      locale: {
        replySet: 'Preferred locale updated to %s',
        replyGet: 'Preferred locale: %s',
      },
      read: {
        done: 'Done!',
        ok: 'Ok',
        invalidId: 'Wrong message Id',
        notTextBased: 'The channel is not text based',
      },
      register: {
        checkDM: 'Look your DM',
        embed: {
          title:
            'Use this link to link your Spotify account to %s (Link valid for 1 hour)',
        },
      },
      stats: {
        title: "Bot's statistics",
        ping: 'Ping',
        uptime: 'Running time',
        memory: 'Memory',
        servers: 'Servers',
        playlistsUpdated: 'Updated playlist',
        channelScanned: 'Listened channels',
        version: 'Version',
      },
      ping: 'Pong! - EN',
    },
  },
  fr: {
    localName: 'Fran??ais',
    message: {
      dbError:
        // TODO: Ajouter le lien vers github
        "Erreur lors de la connexion ?? base de donn??e. Si l'incident persiste merci d'ajouter un ticker sur Github (https://s.kosmo.ovh/dotify)",
      alreadySave: 'Ce salon est d??j?? enregistr??',
      commandError: "Une erreur est survenu lors de l'execution de la commande",
      rateLimited:
        "D??lai d'attente: %s avant la prochaine utilisation de la commande",
    },
    commands: {
      channel: {
        get: {
          embed: {
            title: 'Salon%s en ??coute sur ce serveur %s',
            limited: '(R??ponse limit?? ?? 25 salons)',
            description: 'ajout?? le, par',
            fields: '%s par %s',
          },
          reply:
            "Aucun salon est en ??coute sur ce serveur, pour en ajouter utilisez la commande `/channel add` suivis d'un nom de salon.",
        },
        add: {
          reply: 'Salon %s ajout??!',
        },
        delete: {
          reply: 'Salon %s supprim??!',
        },
      },
      enable: {
        deleted: 'Ce salon ne mettra plus ?? jour votre Playlist!',
        saved: 'Salon ajout??!',
        savedNoPlaylist:
          "Salon ajout??! Mais vous n'avez pas configur?? de playlist sur le site: %s/playlist",
        notFound:
          'Utilisateur introuvable. Merci de vous enregistrer au pr??alable en tapant la command `/register`.',
      },
      locale: {
        replySet: 'Mise ?? jour de la langue pr??f??r??e du serveur vers %s',
        replyGet: 'Localisation pr??f??r??e: %s',
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
            'Cliquez sur ce lien pour lier votre compte Spotify ?? %s (Lien valide 1 heure)',
        },
      },
      stats: {
        title: 'Statistique du bot',
        ping: 'Ping',
        uptime: 'Dur??e de fonctionnement',
        memory: 'M??moire',
        servers: 'Serveurs',
        playlistsUpdated: 'Playlists mise ?? jour',
        channelScanned: 'Salon analys??',
        version: 'Version',
      },
      ping: 'Pong! - FR',
    },
  },
};

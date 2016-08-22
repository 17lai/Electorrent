'use strict';

angular.module('torrentApp').factory('TorrentQ', ['AbstractTorrent', function(AbstractTorrent) {

    /**
    hash (string),
    status* (integer),
    name (string),
    size (integer in bytes),
    percent progress (integer in per mils),
    downloaded (integer in bytes),
    upload-speeded (integer in bytes),
    ratio (integer in per mils),
    upload-speed speed (integer in bytes per second),
    download speed (integer in bytes per second),
    eta (integer in seconds),
    label (string),
    peers connected (integer),
    peers in swarm (integer),
    seeds connected (integer),
    seeds in swarm (integer),
    availability (integer in 1/65535ths),
    torrent queue order (integer),
    remaining (integer in bytes)
    */

    /**
     * Constructor, with class name
     */
    function TorrentQ(hash, data) {

        AbstractTorrent.call(this, {
            hash: hash,
            status: undefined,
            name: data.name,
            size: data.size || data.total_size,
            percent: data.progress * 1000 || undefined,
            downloaded: data.total_downloaded,
            uploaded: data.total_uploaded,
            ratio: data.share_ration || data.ratio,
            uploadSpeed: data.up_speed || data.upspeed,
            downloadSpeed: data.dl_speed || data.dlspeed,
            eta: data.eta,
            label: data.category,
            peersConnected: data.nb_connections,
            peersInSwarm: data.peers_total,
            seedsConnected: data.seeds,
            seedsInSwarm: data.seeds_total || data.num_complete,
            availability: undefined,
            torrentQueueOrder: data.priority,
            remaining: undefined,
            downloadUrl: undefined,
            rssFeedUrl: undefined,
            statusMessage: data.state,
            streamId: undefined,
            dateAdded: (data.addition_date || data.added_on) * 1000 || undefined,
            dateCompleted: (data.completion_date || data.completion_on) * 1000 || undefined,
            appUpdateUrl: undefined,
            savePath: data.savePath,
            additionalData: undefined
        });

        this.creationDate = data.creation_date;
        this.pieceSize = data.piece_size;
        this.comment = data.comment;
        this.totalWasted = data.total_wasted;
        this.uploadedSession = data.total_uploaded_session;
        this.downloadedSession = data.total_downloaded_session;
        this.upLimit = data.up_limit;
        this.downLimit = data.dl_limit;
        this.timeElapsed = data.time_elapsed;
        this.seedingTime = data.seeding_time;
        this.connectionsLimit = data.nb_connections_limit;
        this.createdBy = data.created_by;
        this.downAvgSpeed = data.dl_speed_avg;
        this.lastSeen = data.last_seen;
        this.peers = data.peers;
        this.havePieces = data.pieces_have;
        this.totalPieces = data.pieces_num;
        this.reannounce = data.reannounce;
        this.upSpeedAvg = data.up_speed_avg;
        this.forceStart = data.force_start;
        this.leechersInSwarm = data.num_incomplete;
        this.leechersConnected = data.num_leechs;
        this.sequentialDownload = data.seq_dl;

    }

    // Inherit by prototypal inheritance
    TorrentQ.prototype = Object.create(AbstractTorrent.prototype);

    TorrentQ.prototype.getStatus = function() {
        var args = Array.prototype.slice.call(arguments);
        return (args.indexOf(this.statusMessage) > -1);
    }

    TorrentQ.prototype.isStatusError = function() {
        return this.getStatus('error');
    };
    TorrentQ.prototype.isStatusStopped = function() {
        return this.getStatus('paused', 'pausedUP', 'pausedDL');
    };
    TorrentQ.prototype.isStatusQueued = function() {
        return this.getStatus('queuedUP', 'queuedDL');
    };
    TorrentQ.prototype.isStatusCompleted = function() {
        return (this.percent === 1000) || this.getStatus('checkingUP');
    };
    TorrentQ.prototype.isStatusDownloading = function() {
        return this.getStatus('downloading', 'checkingDL', 'stalledDL')
    };
    TorrentQ.prototype.isStatusSeeding = function() {
        return this.getStatus('uploading', 'stalledUP')
    };
    TorrentQ.prototype.isStatusPaused = function() {
        return this.getStatus('pausedDL');
    };

    TorrentQ.prototype.statusColor = function () {
        if (this.isStatusSeeding()){
            return 'orange';
        } else if (this.isStatusDownloading()){
            return 'blue';
        } else if (this.isStatusError()){
            return 'error';
        } else if (this.isStatusCompleted()){
            return 'success';
        } else if (this.isStatusPaused()){
            return 'grey';
        } else {
            return 'disabled';
        }
    };

    TorrentQ.prototype.statusText = function () {
        if (this.isStatusSeeding()){
            return 'Seeding';
        } else if (this.isStatusDownloading()){
            return 'Downloading';
        } else if (this.isStatusError()){
            return 'Error';
        } else if (this.isStatusCompleted()){
            return 'Completed';
        } else if (this.isStatusPaused()){
            return 'Paused';
        } else if (this.isStatusStopped()){
            return 'Stopped';
        } else {
            return 'Unknown';
        }
    };

    /**
     * Return the constructor function
     */
    return TorrentQ;
}]);
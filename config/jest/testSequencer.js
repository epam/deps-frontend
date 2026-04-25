
const Sequencer = require('@jest/test-sequencer').default

class CustomSequencer extends Sequencer {
  /**
   * Select tests for shard requested via --shard=shardIndex/shardCount
   */
  shard (tests, { shardIndex, shardCount }) {
    const shardSize = Math.ceil(tests.length / shardCount)
    const shardStart = shardSize * (shardIndex - 1)
    const shardEnd = shardSize * shardIndex
    return [...tests].slice(shardStart, shardEnd)
  }
}

module.exports = CustomSequencer

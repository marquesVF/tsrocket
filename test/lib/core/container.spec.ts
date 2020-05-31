import { Container } from '../../../lib/core/container'
import { Injectable } from '../../fixture/injectable'

describe('Container', () => {
    describe('instance management', () => {
        Container.set(Injectable)
        const instance = Container.get(Injectable)

        it('should be able to get an instance based on its class', () => {
            expect(instance).toBeInstanceOf(Injectable)
        })

        it('should have only one instance of injectable', () => {
            expect(instance).toBe(Container.get(Injectable))
        })
    })
})
